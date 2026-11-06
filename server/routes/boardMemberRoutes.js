import express from "express";
import authenticate from "../middleware/authMiddleware.js";
import requireBoardMember from "../middleware/requireBoardMember.js";
import { addBoardMember } from "../controllers/boardMemberController.js";

const router = express.Router({ mergeParams: true });

router.post("/", authenticate, requireBoardMember, addBoardMember);

export default router;
