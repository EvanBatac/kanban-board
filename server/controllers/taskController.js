import pool from "../config/db.js";
export const createTask = async (req, res, next) => {
  try {
    const columnId = Number(req.params.columnId);
    const validColumnId = Number.isInteger(columnId) && columnId > 0;

    if (!validColumnId) {
      return res.status(400).json({
        success: false,
        message: "Invalid column ID",
      });
    }

    const [rows] = await pool.query(
      "SELECT id FROM board_columns WHERE id = ? AND board_id = ?",
      [columnId, req.board.id],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Column not found",
      });
    }

    const { title, description, due_date, assigned_to } = req.body ?? {};

    if (typeof title !== "string") {
      return res.status(400).json({
        success: false,
        message: "Title must be a string",
      });
    }

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    if (trimmedTitle.length > 255) {
      return res.status(400).json({
        success: false,
        message: "Title must be 255 characters or less",
      });
    }

    if (
      description !== undefined &&
      description !== null &&
      typeof description !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Description must be a string or null",
      });
    }
    const taskDescription = description ?? null;

    if (
      due_date !== undefined &&
      due_date !== null &&
      (typeof due_date !== "string" || isNaN(new Date(due_date).getTime()))
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid due date",
      });
    }
    const taskDueDate = due_date ?? null;
    
    const taskAssignedTo = assigned_to ?? null;
    if (
      taskAssignedTo !== null &&
      (!Number.isInteger(taskAssignedTo) || taskAssignedTo <= 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid assignee ID",
      });
    }

    if (taskAssignedTo !== null) {
      const [boardRows] = await pool.query(
        "SELECT user_id FROM board_members WHERE user_id = ? AND board_id = ?",
        [taskAssignedTo, req.board.id],
      );

      if (boardRows.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Assignee must be a member of this board",
        });
      }
    }

    const [taskRows] = await pool.query(
      "SELECT COALESCE(MAX(position) + 1, 0) AS next_position FROM tasks WHERE column_id = ?",
      [columnId],
    );

    const position = taskRows[0].next_position;

    const [result] = await pool.query(
      "INSERT INTO tasks ( title, description, due_date, column_id, position, assigned_to ) VALUES ( ?, ?, ?, ?, ?, ? )",
      [
        trimmedTitle,
        taskDescription,
        taskDueDate,
        columnId,
        position,
        taskAssignedTo,
      ],
    );

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: {
        task: {
          id: result.insertId,
          title: trimmedTitle,
          description: taskDescription,
          due_date: taskDueDate,
          column_id: columnId,
          position,
          assigned_to: taskAssignedTo,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
