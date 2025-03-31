import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { acceptRequest, addFriend, getAllUsers, rejectRequest, updateProfile } from "../controllers/userController.js";
const router = express.Router();


router.put("/update-profile", authMiddleware, updateProfile);
router.post("/add-friend", authMiddleware, addFriend);
router.get("/all-users", authMiddleware, getAllUsers);
router.post('/accept-request', authMiddleware, acceptRequest);
router.post('/reject-request', authMiddleware, rejectRequest);

export default router;
