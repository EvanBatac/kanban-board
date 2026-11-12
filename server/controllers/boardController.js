import pool from "../config/db.js";
import { logActivity } from "../utils/logActivity.js";

export const createBoard = async (req, res, next) => {
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
      message: "Name must not exceed 100 characters",
    });
  }
  let connection;
  try {
    connection = await pool.getConnection();

    await connection.beginTransaction();

    const [boardsResult] = await connection.query(
      "INSERT INTO boards ( name, created_by) VALUES ( ?, ? )",
      [trimmedName, req.user.id],
    );
    await connection.query(
      "INSERT INTO board_members (user_id, board_id, role) VALUES ( ? , ?, ? )",
      [req.user.id, boardsResult.insertId, "owner"],
    );

    await connection.commit();

    try {
      await logActivity({
        userId: req.user.id,
        boardId: boardsResult.insertId,
        action: "created",
        details: `Created board "${trimmedName}"`,
      });
    } catch (error) {
      console.error("Failed to log board activity:", error);
    }

    return res.status(201).json({
      success: true,
      message: "Board created successfully",
      data: {
        board: {
          id: boardsResult.insertId,
          name: trimmedName,
        },
      },
    });
  } catch (error) {
    if (connection) await connection.rollback();
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

export const getBoards = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT b.id, b.name, b.created_by, bm.role AS role 
       FROM boards b
       INNER JOIN board_members bm 
        ON b.id = bm.board_id 
       WHERE bm.user_id = ? 
       ORDER BY b.id DESC`,
      [req.user.id],
    );

    res.status(200).json({
      success: true,
      data: {
        boards: rows,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getBoardById = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, created_by FROM boards WHERE id = ?",
      [req.board.id],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Board not found",
      });
    }
    res.status(200).json({
      success: true,
      data: {
        board: {
          ...rows[0],
          role: req.board.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBoard = async (req, res, next) => {
  try {
    if (req.board.role !== "owner") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this board",
      });
    }

    await pool.query("DELETE FROM boards WHERE id = ?", [req.board.id]);

    return res.status(200).json({
      success: true,
      message: "Board deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
