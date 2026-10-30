import express from "express";
import authenticate from "../middleware/authMiddleware.js";
import requireBoardMember from "../middleware/requireBoardMember.js";
import { createColumn, getColumns } from "../controllers/columnController.js";
const router = express.Router({ mergeParams: true });

router.post("/", authenticate, requireBoardMember, createColumn);
router.get("/", authenticate, requireBoardMember, getColumns);

export default router;
