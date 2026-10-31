import express from "express";
import authenticate from "../middleware/authMiddleware.js";
import requireBoardMember from "../middleware/requireBoardMember.js";
import {
  createBoard,
  getBoards,
  getBoardById,
} from "../controllers/boardController.js";
import { getBoardTasks } from "../controllers/taskController.js";
const router = express.Router();

router.post("/", authenticate, createBoard);
router.get("/", authenticate, getBoards);
router.get("/:id", authenticate, requireBoardMember, getBoardById);
router.get("/:id/tasks", authenticate, requireBoardMember, getBoardTasks);

export default router;
