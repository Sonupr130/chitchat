import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { getMessages, markMessageRead, sendMessage } from "../controllers/chatController.js";
import User from "../models/userModel.js";
const router = express.Router();

router.post("/send", authMiddleware, sendMessage);
router.get("/messages", authMiddleware, getMessages);
router.post("/markRead", authMiddleware, markMessageRead);


// In your user routes
router.get('/:id', authMiddleware, async (req, res) => {
    try {
      const user = await User.findById(req.params.id)
        .populate('chats', 'name photo photoCloudinary status');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user', error: error.message });
    }
  });

export default router;
