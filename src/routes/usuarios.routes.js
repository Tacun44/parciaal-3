import { Router } from "express";
import { pool } from "../db.js";
import bcrypt from "bcryptjs";
const router = Router();
router.get("/", async (_req, res, next) => {
  try {
    // Consulta que une las tres tablas y asigna alias legibles
    const [rows] = await pool.query(`
        SELECT 
        u.username,
        u.nombre,
        u.edad,
        e.nombre AS estado, 
        t.nombre AS tipo, 
        u.id_estado,
        u.id_tipo_usuario
        FROM usuario u
        JOIN estado e ON e.id = u.id_estado
        JOIN tipo_usuario t ON t.id = u.id_tipo_usuario
        ORDER BY u.username`);
    res.json(rows);
  } catch (e) {
    next(e);
  }
});
router.get("/:username", async (req, res, next) => {
  try {
    const { username } = req.params;
    const [rows] = await pool.query(
      "SELECT username, nombre, edad, id_estado, id_tipo_usuario FROM usuario WHERE username = ?",
      [username]
    );
    if (!rows.length) return res.status(404).json({ error: "No encontrado" });
    res.json(rows[0]);
  } catch (e) {
    next(e);
  }
});
