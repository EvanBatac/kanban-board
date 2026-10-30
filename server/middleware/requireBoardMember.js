import pool from "../config/db.js";
export default async function requireBoardMember(req, res, next) {
  try {
    const boardId = Number(req.params.id);
    const userId = req.user.id;

    const validBoardId = Number.isInteger(boardId) && boardId > 0;

    if (!validBoardId) {
      return res.status(400).json({
        success: false,
        message: "Invalid board ID",
      });
    }

    const [rows] = await pool.query(
      "SELECT role FROM board_members WHERE user_id = ? AND board_id = ?",
      [userId, boardId],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Board not found",
      });
    }

    req.board = { id: boardId, role: rows[0].role };
    next();
  } catch (error) {
    next(error);
  }
}
