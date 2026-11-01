import pool from "../config/db.js";

export async function logActivity({
  userId,
  boardId,
  taskId = null,
  action,
  details,
}) {
  await pool.query(
    "INSERT INTO activity_logs (user_id, board_id, task_id, action, details) VALUES ( ?, ?, ?, ?, ? )",
    [userId, boardId, taskId, action, details],
  );
}
