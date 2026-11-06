import express from "express";
import authenticate from "../middleware/authMiddleware.js";
import requireBoardMember from "../middleware/requireBoardMember.js";
import {
  addBoardMember,
  getBoardMembers,
} from "../controllers/boardMemberController.js";

const router = express.Router({ mergeParams: true });

router.post("/", authenticate, requireBoardMember, addBoardMember);
router.get("/", authenticate, requireBoardMember, getBoardMembers);

export default router;
