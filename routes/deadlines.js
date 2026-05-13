const express = require("express");
const router = express.Router();
const pool = require("../db");


// GET all deadlines
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM deadlines
      ORDER BY date, time
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to fetch deadlines",
    });
  }
});


// CREATE deadline
router.post("/", async (req, res) => {
  try {
    const {
      id,
      title,
      category,
      date,
      time,
      duration,
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO deadlines
      (id, title, category, date, time, duration)
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *
      `,
      [
        id,
        title,
        category,
        date,
        time,
        duration,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to create deadline",
    });
  }
});


// UPDATE deadline
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      category,
      date,
      time,
      duration,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE deadlines
      SET
        title=$1,
        category=$2,
        date=$3,
        time=$4,
        duration=$5
      WHERE id=$6
      RETURNING *
      `,
      [
        title,
        category,
        date,
        time,
        duration,
        id,
      ]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to update deadline",
    });
  }
});


// DELETE deadline
router.delete("/:id", async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM deadlines WHERE id=$1",
      [req.params.id]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to delete deadline",
    });
  }
});

module.exports = router;