import express from "express";
import {
  signup,
  login,
  getMe,
  seedUsers,
} from "../controllers/authController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.post("/login", login);

router.post("/signup", signup);

router.get("/me", protect, getMe);

router.post("/seed", seedUsers);

export default router;
