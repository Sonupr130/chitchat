import User from "../models/userModel.js";

export const updateProfile = async (req, res) => {
  const { name, photo } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, photo },
      { new: true }
    );

    res.status(200).json({ message: "Profile Updated", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Error updating profile", error: err });
  }
};

export const addFriend = async (req, res) => {
  const { friendId } = req.body;

  try {
    // Validate friendId
    if (!mongoose.Types.ObjectId.isValid(friendId)) {
      return res.status(400).json({ message: "Invalid friend ID" });
    }

    // Check if friend exists
    const friend = await User.findById(friendId);
    if (!friend) {
      return res.status(404).json({ message: "Friend not found" });
    }

    // Get current user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if already friends
    if (user.friends.includes(friendId)) {
      return res.status(400).json({ 
        message: "Already friends",
        friends: user.friends 
      });
    }

    // Add friend
    user.friends.push(friendId);
    await user.save();

    // Optionally: Add notification system here
    // await Notification.create({
    //   recipient: friendId,
    //   sender: req.user.id,
    //   type: 'friend_request'
    // });

    return res.status(200).json({ 
      success: true,
      message: "Friend request sent",
      friends: user.friends 
    });

  } catch (err) {
    console.error("Error adding friend:", err);
    return res.status(500).json({ 
      success: false,
      message: "Error adding friend",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ success: true, users });
  } catch (err) {
    res.status(500).json({success: false,  message: "Error fetching users", error: err });
  }
};


export const acceptRequest = async (req, res) => {
  try {
    const { requestId } = req.body;
    const userId = req.user.id;

    // 1. Add each other as friends
    await User.findByIdAndUpdate(userId, {
      $push: { friends: requestId },
      $pull: { friendRequests: requestId }
    });
    
    await User.findByIdAndUpdate(requestId, {
      $push: { friends: userId },
      $pull: { sentRequests: userId }
    });

    // 2. Return success response
    res.status(200).json({
      success: true,
      message: "Friend request accepted",
      newFriend: requestId
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error accepting friend request",
      error: err.message
    });
  }
};

export const rejectRequest = async (req, res) => {
  try {
    const { requestId } = req.body;
    const userId = req.user.id;

    // Remove from requests
    await User.findByIdAndUpdate(userId, {
      $pull: { friendRequests: requestId }
    });
    
    await User.findByIdAndUpdate(requestId, {
      $pull: { sentRequests: userId }
    });

    res.status(200).json({
      success: true,
      message: "Friend request rejected"
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error rejecting friend request",
      error: err.message
    });
  }
};