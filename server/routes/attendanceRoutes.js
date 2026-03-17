import express from "express";
import {
  getAttendance,
  createAttendance,
  deleteAttendance,
} from "../controllers/attendanceController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();
router.get("/", protect, getAttendance);
router.post("/", protect, adminOnly, createAttendance);
router.delete("/:id", protect, adminOnly, deleteAttendance);
export default router;
