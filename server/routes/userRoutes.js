import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { acceptRequest, addFriend, getAllUsers, getFriendRequests, getFriends, getSentRequests, rejectRequest, updateProfilePicture } from "../controllers/userController.js";
import multer from "multer";
const router = express.Router();
const upload = multer({ dest: 'uploads/' });


router.put("/update-profile", authMiddleware, updateProfilePicture);
router.post("/add-friend", authMiddleware, addFriend);
router.get("/all-users", authMiddleware, getAllUsers);
router.post('/accept-request', authMiddleware, acceptRequest);
router.post('/reject-request', authMiddleware, rejectRequest);

router.get('/friend-requests', authMiddleware, getFriendRequests);
router.get('/sent-requests', authMiddleware, getSentRequests);
router.get("/friends", authMiddleware, getFriends);

router.patch(
    '/:userId/profile-picture',
    authMiddleware,
    upload.single('profilePicture'),
    updateProfilePicture
  );

export default router;
