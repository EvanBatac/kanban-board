import express from "express";
import authenticate from "../middleware/authMiddleware.js";
import { createBoard, getBoards } from "../controllers/boardController.js";
const router = express.Router();

router.post("/", authenticate, createBoard);
router.get("/", authenticate, getBoards);

export default router;
