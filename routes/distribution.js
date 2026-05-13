const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET distribution
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM time_distribution
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to fetch distribution",
    });
  }
});

// REPLACE distribution
router.post("/", async (req, res) => {
  const client = await pool.connect();

  try {
    const distribution = req.body;

    await client.query("BEGIN");

    // delete old rows
    await client.query(`
      DELETE FROM time_distribution
    `);

    // insert new rows
    for (const item of distribution) {
      await client.query(
        `
        INSERT INTO time_distribution
        (id, name, value)
        VALUES ($1,$2,$3)
        `,
        [
          item.id,
          item.name,
          item.value,
        ]
      );
    }

    await client.query("COMMIT");

    res.json({
      success: true,
    });
  } catch (err) {
    await client.query("ROLLBACK");

    console.error(err);

    res.status(500).json({
      error: "Failed to save distribution",
    });
  } finally {
    client.release();
  }
});

module.exports = router;