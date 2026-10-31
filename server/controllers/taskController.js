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
    const taskDueDate = due_date == null ? null : new Date(due_date);

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

export const getBoardTasks = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT t.id, 
              t.title, 
              t.description, 
              t.due_date, 
              t.column_id, 
              t.position, 
              t.assigned_to, 
              u.name AS assignee_name 
      FROM tasks t 
      INNER JOIN board_columns bc 
        ON t.column_id = bc.id 
      LEFT JOIN users u 
        ON t.assigned_to = u.id 
      WHERE bc.board_id = ? 
      ORDER BY bc.position ASC, t.position ASC`,
      [req.board.id],
    );
    return res.status(200).json({
      success: true,
      data: {
        tasks: rows,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const taskId = Number(req.params.taskId);
    const validTaskId = Number.isInteger(taskId) && taskId > 0;

    if (!validTaskId) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    const [rows] = await pool.query(
      `SELECT t.column_id 
       FROM tasks t
       INNER JOIN board_columns bc
       ON t.column_id = bc.id
       WHERE bc.board_id = ? AND t.id = ?`,
      [req.board.id, taskId],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    const { title, description, due_date, assigned_to } = req.body ?? {};

    const allowedFields = ["title", "description", "due_date", "assigned_to"];

    const hasUpdate = allowedFields.some((field) =>
      Object.hasOwn(req.body ?? {}, field),
    );

    if (!hasUpdate) {
      return res.status(400).json({
        success: false,
        message: "Nothing to update",
      });
    }

    let trimmedTitle;

    if (title !== undefined) {
      if (typeof title !== "string") {
        return res.status(400).json({
          success: false,
          message: "Title must be a string",
        });
      }

      trimmedTitle = title.trim();

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
    }

    let taskDescription;

    if (description !== undefined) {
      if (description !== null && typeof description !== "string") {
        return res.status(400).json({
          success: false,
          message: "Description must be a string or null",
        });
      }

      taskDescription = description;
    }

    let taskDueDate;

    if (due_date !== undefined) {
      if (
        due_date !== null &&
        (typeof due_date !== "string" || isNaN(new Date(due_date).getTime()))
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid due date",
        });
      }

      taskDueDate = due_date === null ? null : new Date(due_date);
    }

    let taskAssignedTo;

    if (assigned_to !== undefined) {
      if (
        assigned_to !== null &&
        (!Number.isInteger(assigned_to) || assigned_to <= 0)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid assignee ID",
        });
      }

      taskAssignedTo = assigned_to;
    }

    if (taskAssignedTo !== undefined && taskAssignedTo !== null) {
      const [memberRows] = await pool.query(
        `SELECT user_id
     FROM board_members
     WHERE user_id = ? AND board_id = ?`,
        [taskAssignedTo, req.board.id],
      );

      if (memberRows.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Assignee must be a member of this board",
        });
      }
    }

    const fields = [];
    const values = [];

    if (title !== undefined) {
      fields.push("t.title = ?");
      values.push(trimmedTitle);
    }

    if (description !== undefined) {
      fields.push("t.description = ?");
      values.push(taskDescription);
    }

    if (due_date !== undefined) {
      fields.push("t.due_date = ?");
      values.push(taskDueDate);
    }

    if (assigned_to !== undefined) {
      fields.push("t.assigned_to = ?");
      values.push(taskAssignedTo);
    }

    values.push(taskId, req.board.id);

    await pool.query(
      `UPDATE tasks t
       INNER JOIN board_columns bc ON t.column_id = bc.id
       SET ${fields.join(", ")}
       WHERE t.id = ? AND bc.board_id = ?`,
      values,
    );

    const [updatedRows] = await pool.query(
      `SELECT
         t.id,
         t.title,
         t.description,
         t.due_date,
         t.column_id,
         t.position,
         t.assigned_to,
         u.name AS assignee_name
       FROM tasks t
       INNER JOIN board_columns bc ON t.column_id = bc.id
       LEFT JOIN users u ON t.assigned_to = u.id
       WHERE t.id = ? AND bc.board_id = ?`,
      [taskId, req.board.id],
    );
    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: {
        task: updatedRows[0],
      },
    });
  } catch (error) {
    next(error);
  }
};
