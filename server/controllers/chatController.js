import Chat from "../models/chatModel.js";
import User from "../models/userModel.js";
import mongoose from "mongoose";


export const sendMessage = async (req, res) => {
  const { senderId, receiverId, groupId, message } = req.body;

  try {
    const chatData = { senderId, message, readBy: [senderId] };
    
    if (groupId) chatData.groupId = groupId;
    else chatData.receiverId = receiverId;

    const chat = await Chat.create(chatData);
    res.status(200).json(chat);
  } catch (err) {
    res.status(500).json({ message: "Error sending message", error: err });
  }
};

export const getMessages = async (req, res) => {
  const { senderId, receiverId, groupId } = req.query;

try {
  const query = groupId ? { groupId } : {
    $or: [{ senderId, receiverId }, { senderId: receiverId, receiverId: senderId }]
  };

  const chats = await Chat.find(query).sort("timestamp");
  res.status(200).json(chats);
} catch (err) {
  res.status(500).json({ message: "Error fetching messages", error: err });
}
};



// In your userController.js
export const createChat = async (req, res) => {
  try {
    const { friendId } = req.body;
    const userId = req.user._id;

    // Validate friendId
    if (!mongoose.Types.ObjectId.isValid(friendId)) {
      return res.status(400).json({ message: 'Invalid friend ID' });
    }

    // Check if users exist
    const [user, friend] = await Promise.all([
      User.findById(userId),
      User.findById(friendId)
    ]);

    if (!user || !friend) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if chat already exists
    if (user.chats.includes(friendId)) {
      return res.status(200).json({ 
        success: true,
        message: 'Chat already exists'
      });
    }

    // Add to both users' chat lists
    await User.findByIdAndUpdate(userId, {
      $addToSet: { chats: friendId }
    });

    await User.findByIdAndUpdate(friendId, {
      $addToSet: { chats: userId }
    });

    // Return the updated chat list
    const updatedUser = await User.findById(userId).populate({
      path: 'chats',
      select: '_id name email photo status'
    });

    res.status(200).json({
      success: true,
      chats: updatedUser.chats.map(chat => ({
        id: chat._id,
        name: chat.name,
        status: chat.status || "Offline",
        photo: chat.photo
      }))
    });

  } catch (error) {
    console.error('Error creating chat:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error creating chat',
      error: error.message 
    });
  }
};



export const getChats = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Find the user and populate the chats
    const user = await User.findById(userId)
      .populate({
        path: 'chats',
        select: '_id name email photo status lastSeen'
      });
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Format the chats for the frontend
    const formattedChats = user.chats.map(chat => ({
      id: chat._id,
      name: chat.name,
      status: chat.status || "Offline",
      lastMessage: `Chat with ${chat.name}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      unread: false,
      image: chat.photo
    }));

    res.status(200).json({ 
      success: true,
      chats: formattedChats
    });
  } catch (error) {
    console.error("Error fetching chats:", error);
    res.status(500).json({ 
      success: false,
      message: "Error fetching chats",
      error: error.message 
    });
  }
};








export const createGroup = async (req, res) => {
    const { name, members } = req.body;

  try {
    const group = await Group.create({ name, members });
    res.status(200).json(group);
  } catch (err) {
    res.status(500).json({ message: "Error creating group", error: err });
  }
}



export const markAsRead = async (req, res) => {
  const { messageId, userId } = req.body;

  try {
    await Chat.findByIdAndUpdate(messageId, { $addToSet: { readBy: userId } });
    res.status(200).json({ message: "Message marked as read" });
  } catch (err) {
    res.status(500).json({ message: "Error marking message", error: err });
  }
};