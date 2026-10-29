import express from "express";
import cors from "cors";
import "dotenv/config";
import pool from "./config/db.js";

const port = Number(process.env.PORT);

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

app.get("/api/health", (req, res) => {
  res.json({
    message: "Healthy",
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
