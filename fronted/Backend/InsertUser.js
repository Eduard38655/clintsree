import express from "express";
import pool from "./db.js";

const router = express.Router();

router.post("/user", async (req, res) => {
  try {
    const { nombre, apellido, balance, status, fecha } = req.body;

    const result = await pool.query(
      `
      INSERT INTO cliente
      (nombre, apellido, fecha, balance, status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [nombre, apellido, fecha, balance, status]
    );

    res.json({
      ok: true,
      data: result.rows[0],
    });
  } catch (err) {
    console.error("❌ Error:", err.message);

    res.status(500).json({
      ok: false,
      error: err.message,
    });
  }
});

router.put("/UpdateUser/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, balance, status, fecha } = req.body;

  try {
    const result = await pool.query(
      `
      UPDATE cliente_qyqz
      SET
        nombre = $1,
        apellido = $2,
        fecha = $3,
        balance = $4,
        status = $5
      WHERE id = $6
      RETURNING *
      `,
      [nombre, apellido, fecha, balance, status, id]
    );

    res.json({
      ok: true,
      data: result.rows[0],
    });
  } catch (err) {
    console.error("❌ Error:", err.message);

    res.status(500).json({
      ok: false,
      error: err.message,
    });
  }
});

export default router;