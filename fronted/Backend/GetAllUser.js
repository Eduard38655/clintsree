import express from "express";
import pool from "./db.js";

const router = express.Router();

router.get("/info", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM cliente"
    );

    console.log(`✅ ${result.rows.length} registros obtenidos`);

    
    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows,
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