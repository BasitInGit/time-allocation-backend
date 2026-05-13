const express = require("express");
const router = express.Router();
const pool = require("../db");


// GET all tasks
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM tasks ORDER BY date, time"
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});


// CREATE task
router.post("/", async (req, res) => {
  try {
    const {
      id,
      title,
      category,
      date,
      time,
      duration,
      details,
      color,
      generated,
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO tasks
      (id, title, category, date, time, duration, details, color, generated)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *
      `,
      [
        id,
        title,
        category,
        date,
        time,
        duration,
        details,
        color,
        generated,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create task" });
  }
});


// UPDATE task
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      category,
      date,
      time,
      duration,
      details,
      color,
      generated,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE tasks
      SET
        title=$1,
        category=$2,
        date=$3,
        time=$4,
        duration=$5,
        details=$6,
        color=$7,
        generated=$8
      WHERE id=$9
      RETURNING *
      `,
      [
        title,
        category,
        date,
        time,
        duration,
        details,
        color,
        generated,
        id,
      ]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update task" });
  }
});


// DELETE task
router.delete("/:id", async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM tasks WHERE id = $1",
      [req.params.id]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

module.exports = router;