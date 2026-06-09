import express from "express";
import pool from "./db.js";

const router = express.Router();

router.post("/user", async (req, res) => {
  try {
    const { nombre, apellido, balance, status, fecha, email } = req.body;
    const numericBalance = Number(balance);
console.log("POST body:", { nombre, apellido, balance, status, fecha,email});
 
    if (!nombre || !apellido || !email || !status || Number.isNaN(numericBalance)) {
      return res.status(400).json({
        ok: false,
        error: "Datos inválidos: nombre, apellido, email, status y balance son requeridos",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO cliente
      (nombre, apellido, fecha, balance, status, email)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [nombre, apellido, fecha, numericBalance, status, email]
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
  const { nombre, apellido, balance, status, fecha, email } = req.body;
  console.log("PUT body:", { nombre, apellido, balance, status, fecha, email, id });
  try {
    const numericBalance = Number(balance);

    if (!nombre || !apellido || !email || !status || Number.isNaN(numericBalance)) {
      return res.status(400).json({
        ok: false,
        error: "Datos inválidos: nombre, apellido, email, status y balance son requeridos",
      });
    }

    const result = await pool.query(
      `
      UPDATE cliente
      SET
        nombre = $1,
        apellido = $2,
        fecha = $3,
        balance = $4,
        status = $5,
        email = $6
      WHERE id = $7
      RETURNING *
      `,
      [nombre, apellido, fecha, numericBalance, status, email, id]
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