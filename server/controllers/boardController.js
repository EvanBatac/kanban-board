import pool from "../config/db.js";

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
    const id = Number(req.params.id);
    const validId = Number.isInteger(id) && id > 0;

    if (!validId) {
      return res.status(400).json({
        success: false,
        message: "Invalid board ID",
      });
    }

    const [rows] = await pool.query(
      `SELECT b.id, b.name, b.created_by, bm.role AS role 
       FROM boards b
       INNER JOIN board_members bm 
        ON b.id = bm.board_id 
       WHERE bm.user_id = ?  AND b.id = ?`,
       [req.user.id, id],
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
        board: rows[0],
      },
    });
  } catch (error) {
    next(error);
  }
};
