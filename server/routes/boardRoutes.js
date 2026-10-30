import express from "express";
import authenticate from "../middleware/authMiddleware.js";
import {
  createBoard,
  getBoards,
  getBoardById,
} from "../controllers/boardController.js";
const router = express.Router();

router.post("/", authenticate, createBoard);
router.get("/", authenticate, getBoards);
router.get("/:id", authenticate, getBoardById);

export default router;
