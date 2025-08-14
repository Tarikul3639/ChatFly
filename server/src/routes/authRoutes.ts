import { Router } from "express";
import {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
} from "../controllers/authController";

const router = Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes (require authentication)
router.post("/logout", logout);
router.get("/profile", getProfile);
router.put("/profile", updateProfile);

export default router;
