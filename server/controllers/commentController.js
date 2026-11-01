import pool from "../config/db.js";
import { logActivity } from "../utils/logActivity.js";

export const createComment = async (req, res, next) => {
  try {
    const taskId = Number(req.params.taskId);
    const validTaskId = Number.isInteger(taskId) && taskId > 0;

    if (!validTaskId) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    const [taskRows] = await pool.query(
      `SELECT t.id, t.title
       FROM tasks t
       INNER JOIN board_columns bc ON t.column_id = bc.id
       WHERE t.id = ? AND bc.board_id = ?`,
      [taskId, req.board.id],
    );

    if (taskRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    const { content } = req.body ?? {};

    if (typeof content !== "string") {
      return res.status(400).json({
        success: false,
        message: "Content must be a string",
      });
    }

    const trimmedContent = content.trim();

    if (!trimmedContent) {
      return res.status(400).json({
        success: false,
        message: "Content is required",
      });
    }

    if (trimmedContent.length > 1000) {
      return res.status(400).json({
        success: false,
        message: "Content must be 1000 characters or less",
      });
    }

    const [result] = await pool.query(
      "INSERT INTO comments (content, task_id, user_id) VALUES (?, ?, ?)",
      [trimmedContent, taskId, req.user.id],
    );

    const [commentRows] = await pool.query(
      `SELECT c.id, c.content, c.task_id, c.user_id, c.created_at,
              u.name AS user_name
       FROM comments c
       LEFT JOIN users u ON c.user_id = u.id
       WHERE c.id = ?`,
      [result.insertId],
    );

    try {
      await logActivity({
        userId: req.user.id,
        boardId: req.board.id,
        taskId,
        action: "commented",
        details: `Commented on task "${taskRows[0].title}"`,
      });
    } catch (error) {
      console.error("Failed to log comment activity:", error);
    }
    return res.status(201).json({
      success: true,
      message: "Comment created successfully",
      data: {
        comment: commentRows[0],
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getComments = async (req, res, next) => {
  try {
    const taskId = Number(req.params.taskId);
    const validTaskId = Number.isInteger(taskId) && taskId > 0;

    if (!validTaskId) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    const [taskRows] = await pool.query(
      `SELECT t.id
       FROM tasks t
       INNER JOIN board_columns bc ON t.column_id = bc.id
       WHERE t.id = ? AND bc.board_id = ?`,
      [taskId, req.board.id],
    );

    if (taskRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    const [rows] = await pool.query(
      `SELECT c.id, c.content, c.user_id, c.created_at,
              u.name AS user_name
       FROM comments c
       LEFT JOIN users u ON c.user_id = u.id
       WHERE c.task_id = ?
       ORDER BY c.created_at ASC, c.id ASC`,
      [taskId],
    );

    return res.status(200).json({
      success: true,
      data: {
        comments: rows,
      },
    });
  } catch (error) {
    next(error);
  }
};
