const express = require("express");
const router = express.Router();
const pool = require("../db");


// ===============================
// GET all reminders
// ===============================
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM reminders
      ORDER BY reminderdate, remindertime
    `);

    // map DB → frontend format
    const mapped = result.rows.map(r => ({
      id: r.id,
      taskId: r.taskid,
      reminderDate: r.reminderdate,
      reminderTime: r.remindertime,
      frequency: r.frequency,
    }));

    return res.json(mapped);
  } catch (err) {
    console.error("GET /reminders error:", err);
    return res.status(500).json({
      error: "Failed to fetch reminders",
    });
  }
});


// ===============================
// CREATE reminder
// ===============================
router.post("/", async (req, res) => {
  try {
    const {
      id,
      taskId,
      reminderDate,
      reminderTime,
      frequency,
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO reminders
      (id, taskid, reminderdate, remindertime, frequency)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [id, taskId, reminderDate, reminderTime, frequency]
    );

    const r = result.rows[0];

    return res.status(201).json({
      id: r.id,
      taskId: r.taskid,
      reminderDate: r.reminderdate,
      reminderTime: r.remindertime,
      frequency: r.frequency,
    });
  } catch (err) {
    console.error("POST /reminders error:", err);
    return res.status(500).json({
      error: "Failed to create reminder",
    });
  }
});


// ===============================
// UPDATE reminder
// ===============================
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      taskId,
      reminderDate,
      reminderTime,
      frequency,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE reminders
      SET
        taskid = $1,
        reminderdate = $2,
        remindertime = $3,
        frequency = $4
      WHERE id = $5
      RETURNING *
      `,
      [taskId, reminderDate, reminderTime, frequency, id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: "Reminder not found" });
    }

    const r = result.rows[0];

    return res.json({
      id: r.id,
      taskId: r.taskid,
      reminderDate: r.reminderdate,
      reminderTime: r.remindertime,
      frequency: r.frequency,
    });
  } catch (err) {
    console.error("PUT /reminders error:", err);
    return res.status(500).json({
      error: "Failed to update reminder",
    });
  }
});


// ===============================
// DELETE reminder
// ===============================
router.delete("/:id", async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM reminders WHERE id = $1",
      [req.params.id]
    );

    return res.json({ success: true });
  } catch (err) {
    console.error("DELETE /reminders error:", err);
    return res.status(500).json({
      error: "Failed to delete reminder",
    });
  }
});

module.exports = router;