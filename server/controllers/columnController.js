import pool from "../config/db.js";

export const createColumn = async (req, res, next) => {
  try {
    if (req.board.role !== "owner" && req.board.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to create columns",
      });
    }
    const { name } = req.body ?? {};

    if (typeof name !== "string") {
      return res.status(400).json({
        success: false,
        message: "Name must be a string",
      });
    }
    const trimmedName = name.trim();

    if (!trimmedName) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    if (trimmedName.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Name must be 100 characters or less",
      });
    }

    const [rows] = await pool.query(
      "SELECT COALESCE(MAX(position) + 1, 0) AS next_position FROM board_columns WHERE board_id = ?",
      [req.board.id],
    );

    const position = rows[0].next_position;

    const [result] = await pool.query(
      "INSERT INTO board_columns ( name, board_id, position ) VALUES ( ?, ?, ? )",
      [trimmedName, req.board.id, position],
    );

    return res.status(201).json({
      success: true,
      data: {
        column: {
          id: result.insertId,
          name: trimmedName,
          board_id: req.board.id,
          position,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getColumns = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, board_id, position FROM board_columns WHERE board_id = ? ORDER BY position ASC",
      [req.board.id],
    );

    return res.status(200).json({
      success: true,
      data: {
        columns: rows,
      },
    });
  } catch (error) {
    next(error);
  }
};
