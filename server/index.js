import express from "express";
import cors from "cors";
import "dotenv/config";
import pool from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import boardRoutes from "./routes/boardRoutes.js";
import columnRoutes from "./routes/columnRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const port = Number(process.env.PORT);

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);
app.use(express.json());

app.get("/api/health", async (req, res, next) => {
  try {
    const [rows] = await pool.query("SELECT 1 FROM jksdh");
    res.status(200).json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    next(error);
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api/boards/:id/columns", columnRoutes);
app.use("/api/boards/:id/columns/:columnId/tasks", taskRoutes);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
