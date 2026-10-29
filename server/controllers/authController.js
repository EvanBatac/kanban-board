import bcrypt from "bcrypt";
import pool from "../config/db.js";

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body ?? {};

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password must be strings.",
      });
    }

    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedName || !normalizedEmail || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required.",
      });
    }

    if (normalizedName.length > 255) {
      return res.status(400).json({
        success: false,
        message: "Name must be 255 characters or fewer.",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long.",
      });
    }

    if (Buffer.byteLength(password, "utf8") > 72) {
      return res.status(400).json({
        success: false,
        message: "Password must not exceed 72 bytes.",
      });
    }

    const [rows] = await pool.query("SELECT id FROM users WHERE email = ?", [
      normalizedEmail,
    ]);

    if (rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }
    const hashed = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      "INSERT INTO users (name, email, password_hash) VALUES ( ?, ?, ?)",
      [normalizedName, normalizedEmail, hashed],
    );
    res.status(201).json({
      success: true,
      message: "User successfully registered",
      data: {
        id: result.insertId,
        name: normalizedName,
        email: normalizedEmail,
      },
    });
  } catch (error) {
    next(error);
  }
};
