import Chat from "../models/chatModel.js";
import User from "../models/userModel.js";
import mongoose from "mongoose";

export const sendMessage = async (req, res) => {
  const { senderId, receiverId, groupId, message } = req.body;

  try {
    // Validate required fields
    if (!message) {
      return res.status(400).json({ message: "Message content is required" });
    }
    
    if (!senderId) {
      return res.status(400).json({ message: "Sender ID is required" });
    }
    
    if (!receiverId && !groupId) {
      return res.status(400).json({ message: "Either receiverId or groupId is required" });
    }
    
    // Create chat document
    const chatData = { 
      senderId, 
      message, 
      timestamp: new Date(),
      readBy: [senderId] 
    };
    
    if (groupId) {
      chatData.groupId = groupId;
    } else {
      chatData.receiverId = receiverId;
      
      // Update both users' chat lists in a transaction to ensure consistency
      const session = await mongoose.startSession();
      session.startTransaction();
      
      try {
        // Update sender's chats
        await User.findByIdAndUpdate(
          senderId,
          { $addToSet: { chats: receiverId } },
          { session, new: true }
        );
        
        // Update receiver's chats
        await User.findByIdAndUpdate(
          receiverId,
          { $addToSet: { chats: senderId } },
          { session, new: true }
        );
        
        await session.commitTransaction();
      } catch (error) {
        await session.abortTransaction();
        throw error;
      } finally {
        session.endSession();
      }
    }

    const chat = await Chat.create(chatData);
    
    // Return the newly created message
    res.status(201).json(chat);
  } catch (err) {
    console.error("Error in sendMessage:", err);
    res.status(500).json({ message: "Error sending message", error: err.message });
  }
};

export const getMessages = async (req, res) => {
  const { senderId, receiverId, groupId } = req.query;

  try {
    // Ensure required parameters
    if ((!senderId || !receiverId) && !groupId) {
      return res.status(400).json({ message: "Missing required parameters" });
    }
    
    // Build query for direct messages or group messages
    const query = groupId 
      ? { groupId } 
      : {
          $or: [
            { senderId, receiverId }, 
            { senderId: receiverId, receiverId: senderId }
          ]
        };

    // Get messages ordered by timestamp
    const chats = await Chat.find(query)
      .sort({ timestamp: 1 })
      .populate('senderId', 'name photo photoCloudinary')
      .exec();
    
    // Mark messages as seen if they were sent to this user
    if (senderId && !groupId) {
      await Chat.updateMany(
        { senderId: receiverId, receiverId: senderId, readBy: { $ne: senderId } },
        { $addToSet: { readBy: senderId } }
      );
    }
    
    res.status(200).json(chats);
  } catch (err) {
    console.error("Error in getMessages:", err);
    res.status(500).json({ message: "Error fetching messages", error: err.message });
  }
};

// Add a method to handle reading messages
export const markMessageRead = async (req, res) => {
  const { messageId, userId } = req.body;
  
  try {
    if (!messageId || !userId) {
      return res.status(400).json({ message: "MessageId and userId are required" });
    }
    
    const updatedMessage = await Chat.findByIdAndUpdate(
      messageId,
      { $addToSet: { readBy: userId } },
      { new: true }
    );
    
    if (!updatedMessage) {
      return res.status(404).json({ message: "Message not found" });
    }
    
    res.status(200).json(updatedMessage);
  } catch (err) {
    console.error("Error marking message as read:", err);
    res.status(500).json({ message: "Error updating message", error: err.message });
  }
};