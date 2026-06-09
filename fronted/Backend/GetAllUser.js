import express from "express";
import { getPool } from "./db.js";

const router = express.Router();

// GET - Obtener TODOS los clientes
router.get("/info", async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request().query("SELECT * FROM cliente");

    console.log(`✅ ${result.recordset.length} registros obtenidos`);
    res.json({
      success: true,
      count: result.recordset.length,
      data: result.recordset,
    });
  } catch (err) {
    console.error("❌ Error:", err.message);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

export default router;