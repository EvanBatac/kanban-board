import express from "express";
import authenticate from "../middleware/authMiddleware.js";
import requireBoardMember from "../middleware/requireBoardMember.js";
import { createColumn } from "../controllers/columnController.js";
const router = express.Router({ mergeParams: true });

router.post("/", authenticate, requireBoardMember, createColumn);

export default router;
