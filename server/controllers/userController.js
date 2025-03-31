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

// export const addFriend = async (req, res) => {
//   const { friendId } = req.body;

//   try {
//     // Validate friendId
//     if (!mongoose.Types.ObjectId.isValid(friendId)) {
//       return res.status(400).json({ message: "Invalid friend ID" });
//     }

//     // Check if friend exists
//     const friend = await User.findById(friendId);
//     if (!friend) {
//       return res.status(404).json({ message: "Friend not found" });
//     }

//     // Get current user
//     const user = await User.findById(req.user.id);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Check if already friends
//     if (user.friends.includes(friendId)) {
//       return res.status(400).json({ 
//         message: "Already friends",
//         friends: user.friends 
//       });
//     }

//     // Add friend
//     user.sentRequests.push(friendId);
//     await user.save();

//     // Optionally: Add notification system here
//     // await Notification.create({
//     //   recipient: friendId,
//     //   sender: req.user.id,
//     //   type: 'friend_request'
//     // });

//     return res.status(200).json({ 
//       success: true,
//       message: "Friend request sent",
//       friends: user.friends 
//     });

//   } catch (err) {
//     console.error("Error adding friend:", err);
//     return res.status(500).json({ 
//       success: false,
//       message: "Error adding friend",
//       error: process.env.NODE_ENV === 'development' ? err.message : undefined
//     });
//   }
// };





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

    // Check if request already sent
    if (user.sentRequests.includes(friendId)) {
      return res.status(400).json({ 
        message: "Request already sent",
        sentRequests: user.sentRequests 
      });
    }

    // Add to sender's sentRequests and receiver's friendRequests
    user.sentRequests.push(friendId);
    friend.friendRequests.push(req.user.id);
    
    // Save both users
    await Promise.all([user.save(), friend.save()]);

    return res.status(200).json({ 
      success: true,
      message: "Friend request sent",
      sentRequests: user.sentRequests 
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
