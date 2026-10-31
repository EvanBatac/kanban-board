import express from "express";
import authenticate from "../middleware/authMiddleware.js";
import requireBoardMember from "../middleware/requireBoardMember.js";
import { createTask } from "../controllers/taskController.js";

const router = express.Router({ mergeParams: true });

router.post("/", authenticate, requireBoardMember, createTask);
export default router;
