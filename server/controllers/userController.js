import User from "../models/userModel.js";
import mongoose from "mongoose";

export const updateProfilePicture = async (req, res) => {
  try {
    const { userId } = req.params;
    const file = req.file; // From multer middleware

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // 1. Upload to Cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'chitchat/profiles',
      transformation: [
        { width: 200, height: 200, crop: "fill" },
        { quality: "auto" }
      ]
    });

    // 2. Update user in database
    const user = await User.findByIdAndUpdate(
      userId,
      { photoCloudinary: result.secure_url },
      { new: true }
    );

    // 3. Return new photo URL
    res.status(200).json({
      success: true,
      photoUrl: result.secure_url
    });

    // 4. Cleanup - delete temp file
    fs.unlinkSync(file.path);
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ message: "Error updating profile picture" });
  }
};




export const addFriend = async (req, res) => {
  const { friendId } = req.body;

  try {
    // Convert to ObjectId if it's a valid string
    const friendObjectId = mongoose.Types.ObjectId.createFromHexString(friendId);
    const currentUserId = req.user._id; // Use _id consistently

    // Check if friend exists
    const friend = await User.findById(friendObjectId);
    if (!friend) {
      return res.status(404).json({ 
        success: false,
        message: "Friend not found" 
      });
    }

    // Get current user
    const user = await User.findById(currentUserId);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    // Check if trying to add self
    if (friendObjectId.equals(currentUserId)) {
      return res.status(400).json({
        success: false,
        message: "Cannot add yourself as a friend"
      });
    }

    // Check if already friends
    if (user.friends.some(id => id.equals(friendObjectId))) {
      return res.status(400).json({ 
        success: false,
        message: "Already friends"
      });
    }

    // Check if request already sent
    if (user.sentRequests.some(id => id.equals(friendObjectId))) {
      return res.status(400).json({ 
        success: false,
        message: "Request already sent"
      });
    }

    // Add to sender's sentRequests and receiver's friendRequests
    user.sentRequests.push(friendObjectId);
    friend.friendRequests.push(currentUserId);
    
    await Promise.all([user.save(), friend.save()]);

    return res.status(200).json({ 
      success: true,
      message: "Friend request sent"
    });

  } catch (err) {
    console.error("Error adding friend:", err);
    return res.status(400).json({ 
      success: false,
      message: "Invalid friend ID",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};




export const getAllUsers = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const users = await User.find({ 
      _id: { $ne: currentUserId },
      friends: { $ne: currentUserId }
    })
    .select('_id name email photo friends sentRequests')
    .lean();

    const usersWithStatus = users.map(user => ({
      ...user,
      isRequestSent: user.sentRequests.some(id => id.equals(currentUserId))
    }));

    res.status(200).json({ success: true, users: usersWithStatus });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching users" });
  }
};



export const acceptRequest = async (req, res) => {
  try {
    const { requestId } = req.body;
    const currentUserId = req.user._id;

    // Add each other as friends and remove from requests
    await Promise.all([
      User.findByIdAndUpdate(currentUserId, {
        $addToSet: { friends: requestId },
        $pull: { friendRequests: requestId }
      }),
      User.findByIdAndUpdate(requestId, {
        $addToSet: { friends: currentUserId },
        $pull: { sentRequests: currentUserId }
      })
    ]);

    res.status(200).json({ success: true, message: "Friend request accepted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error accepting request" });
  }
};



// Reject friend request
export const rejectRequest = async (req, res) => {
  try {
    const { requestId } = req.body;
    const currentUserId = req.user._id;

    // Remove from requests
    await Promise.all([
      User.findByIdAndUpdate(currentUserId, {
        $pull: { friendRequests: requestId }
      }),
      User.findByIdAndUpdate(requestId, {
        $pull: { sentRequests: currentUserId }
      })
    ]);

    res.status(200).json({ success: true, message: "Friend request rejected" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error rejecting request" });
  }
};

export const getFriendRequests = async (req, res) => {
  try {
    const userId = req.user._id; // Changed from req.user.id to req.user._id
    console.log("User ID from request:", userId);

    // Find the user and populate the friendRequests
    const user = await User.findById(userId)
      .populate({
        path: 'friendRequests',
        select: '_id name email photo status lastSeen' // Include more fields if needed
      });

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    console.log("Friend requests data:", user.friendRequests);
    
    res.status(200).json({ 
      success: true,
      requests: user.friendRequests || [] // Ensure we always return an array
    });

  } catch (err) {
    console.error("Error fetching friend requests:", err);
    res.status(500).json({ 
      success: false,
      message: "Error fetching friend requests",
      error: err.message 
    });
  }
};



export const getSentRequests = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId)
      .populate({
        path: 'sentRequests',
        select: '_id name email photo status lastSeen'
      });
    
    res.status(200).json({
      success: true,
      requests: user.sentRequests || []
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching sent requests"
    });
  }
};


export const getFriends = async (req, res) => {
  try {
    const userId = req.user._id; // Changed from req.user.id to req.user._id
    console.log("User ID from request:", userId);

    // Find the user and populate the friends field
    const user = await User.findById(userId)
      .populate({
        path: 'friends',
        select: '_id name email photo status lastSeen' // Include more fields if needed
      });

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    console.log("Friends data:", user.friends);
    
    res.status(200).json({ 
      success: true,
      friends: user.friends || [] // Ensure we always return an array
    });

  } catch (err) {
    console.error("Error fetching friends:", err);
    res.status(500).json({ 
      success: false,
      message: "Error fetching friends",
      error: err.message 
    });
  }
};


export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // Optional: Validate ID format first
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID' });
    }

    const user = await User.findById(id)
      .select('_id name email photo friends sentRequests friendRequests status lastSeen')
      .lean();

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, user });
  } catch (err) {
    console.error('Error fetching user by ID:', err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};