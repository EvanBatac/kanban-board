import express from "express";
import authenticate from "../middleware/authMiddleware.js";
import { createBoard } from "../controllers/boardController.js";
const router = express.Router();

router.post("/", authenticate, createBoard);

export default router;
