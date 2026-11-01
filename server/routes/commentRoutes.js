import express from "express";
import authenticate from "../middleware/authMiddleware.js";
import requireBoardMember from "../middleware/requireBoardMember.js";
import {
  createComment,
  getComments,
} from "../controllers/commentController.js";

const router = express.Router({ mergeParams: true });

router.post("/", authenticate, requireBoardMember, createComment);
router.get("/", authenticate, requireBoardMember, getComments);

export default router;
