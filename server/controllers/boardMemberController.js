import pool from "../config/db.js";
import { logActivity } from "../utils/logActivity.js";
export const addBoardMember = async (req, res, next) => {
  try {
    const { email, role: requestedRole } = req.body ?? {};
    const role = requestedRole ?? "member";

    if (req.board.role === "admin" && role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Only the owner can add admins",
      });
    }

    if (req.board.role === "member") {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to add members",
      });
    }
    if (typeof email !== "string") {
      return res.status(400).json({
        success: false,
        message: "Email must be a string",
      });
    }
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    if (role !== "admin" && role !== "member") {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const [userRows] = await pool.query(
      "SELECT id, name, email FROM users WHERE email = ?",
      [trimmedEmail],
    );

    if (userRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const userId = userRows[0].id;
    const [memberRows] = await pool.query(
      "SELECT user_id, board_id FROM board_members WHERE user_id = ? AND board_id = ?",
      [userId, req.board.id],
    );

    if (memberRows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "User is already a member",
      });
    }

    const [result] = await pool.query(
      "INSERT INTO board_members ( user_id, board_id, role) VALUES ( ?, ?, ? )",
      [userId, req.board.id, role],
    );

    const [newMember] = await pool.query(
      `SELECT bm.user_id, 
              u.name, 
              u.email,
              bm.role
       FROM board_members bm
       INNER JOIN users u
         ON bm.user_id = u.id
       WHERE bm.id = ?`,
      [result.insertId],
    );

    const member = newMember[0];

    try {
      await logActivity({
        userId: req.user.id,
        boardId: req.board.id,
        action: "created",
        details: `Added ${member.name} as ${member.role}`,
      });
    } catch (error) {
      console.error("Failed to log member activity:", error);
    }

    return res.status(201).json({
      success: true,
      data: {
        member: {
          user_id: member.user_id,
          name: member.name,
          email: member.email,
          role: member.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getBoardMembers = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT bm.user_id, 
              u.name, 
              u.email,
              bm.role
       FROM board_members bm
       INNER JOIN users u
         ON bm.user_id = u.id
       WHERE bm.board_id = ?
       ORDER BY FIELD(bm.role, 'owner', 'admin', 'member'), u.name ASC`,
      [req.board.id],
    );

    return res.status(200).json({
      success: true,
      data: {
        members: rows,
      },
    });
  } catch (error) {
    next(error);
  }
};
