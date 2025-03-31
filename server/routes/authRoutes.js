import express from "express";
import { googleLogin, verifyToken } from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();


router.post("/google-login", googleLogin);
router.get('/verify', authMiddleware, verifyToken);

export default router;
