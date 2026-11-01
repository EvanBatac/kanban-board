import pool from "../config/db.js";

export const getActivity = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT al.id,
       al.action,
       al.details,
       al.task_id,
       al.user_id,
       u.name AS user_name,
       al.created_at
       FROM activity_logs al
       LEFT JOIN users u
         ON al.user_id = u.id
       WHERE al.board_id = ?
       ORDER BY al.created_at DESC, al.id DESC
       LIMIT 50`,
      [req.board.id],
    );

    return res.status(200).json({
      success: true,
      data: {
        activity: rows,
      },
    });
  } catch (error) {
    next(error);
  }
};
