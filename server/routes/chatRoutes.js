import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { createGroup, getMessages, sendMessage } from "../controllers/chatController.js";
const router = express.Router();

router.post("/send", authMiddleware, sendMessage);
router.get("/messages", authMiddleware, getMessages);
router.post("/create-group", authMiddleware, createGroup);

export default router;
