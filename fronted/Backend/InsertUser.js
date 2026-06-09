import express from "express";
import { getPool } from "./db.js";

const router = express.Router();

// GET - Obtener TODOS los clientes
router.post("/user", async (req, res) => {
  try {
    const { nombre, apellido, balance, status, fecha } = req.body;

    const pool = getPool();
    const result = await pool
      .request()
      .input("nombre", nombre)
      .input("apellido", apellido)
      .input("fecha", fecha)
      .input("balance", balance)
      .input("status", status).query(`
    INSERT INTO cliente
    (nombre, apellido, fecha, balance, status)
    VALUES
    (@nombre, @apellido, @fecha, @balance, @status)
  `);
     
    if (result.rowsAffected == 1) {
      return res.json({
        data: "datos oingresado",
        ok: true,
      });
    }
  } catch (err) {
    console.error("❌ Error:", err.message);
    res.status(500).json({
      success: false,
      error: err.message,
       ok: false,
    });
  }
});


 router.put("/UpdateUser/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, balance, status, fecha } = req.body;

  try {
    const result = await getPool()
      .request()
      .input("id", id)
      .input("nombre", nombre)
      .input("apellido", apellido)
      .input("fecha", fecha)
      .input("balance", balance)
      .input("status", status)
      .query(`
        UPDATE cliente
        SET
          nombre = @nombre,
          apellido = @apellido,
          fecha = @fecha,
          balance = @balance,
          status = @status
        WHERE id = @id
      `);

    res.json({
      ok: true,
      rowsAffected: result.rowsAffected[0],
    });
  } catch (err) {
    console.error("❌ Error:", err.message);
    res.status(500).json({
      success: false,
      error: err.message,
      ok: false,
    });
  }
});

 
export default router;
