import express from "express";
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  patchTask,
  deleteTask,
} from "../controllers/taskController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, getTasks);
router.get("/:id", protect, getTask);
router.post("/", protect, adminOnly, createTask);
router.put("/:id", protect, adminOnly, updateTask);
router.patch("/:id", protect, patchTask);
router.delete("/:id", protect, adminOnly, deleteTask);

export default router;
