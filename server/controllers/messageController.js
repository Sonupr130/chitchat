import Chat from "../models/chatModel.js";
import User from "../models/userModel.js";
import mongoose from "mongoose";
import chalk from "chalk";

export const messageController = {
  /**
   * @desc    Send a new message
   * @route   POST /api/messages
   * @access  Private
   */
  sendMessage: async (req, res) => {
    try {
      const { senderId, receiverId, message } = req.body;

      console.log(chalk.yellow.bold("\n=== New Message Request ==="));
      console.log(chalk.cyan(`Sender ID: ${senderId}`));
      console.log(chalk.cyan(`Receiver ID: ${receiverId}`));
      console.log(chalk.cyan(`Message: ${message}`));

      // Validate input
      if (!mongoose.Types.ObjectId.isValid(senderId) || 
          !mongoose.Types.ObjectId.isValid(receiverId) || 
          !message || message.trim() === "") {
        console.log(chalk.red.bold("✖ Validation failed: Invalid input data"));
        return res.status(400).json({ 
          success: false,
          message: "Invalid input data" 
        });
      }

      // Check if users exist
      const sender = await User.findById(senderId);
      const receiver = await User.findById(receiverId);
      
      if (!sender || !receiver) {
        console.log(chalk.red.bold("✖ User not found"));
        return res.status(404).json({ 
          success: false,
          message: "User not found" 
        });
      }

      console.log(chalk.green(`✓ Users verified: ${sender.name} → ${receiver.name}`));

      // Create and save the message
      const newMessage = new Chat({
        senderId,
        receiverId,
        message: message.trim(),
        readBy: [senderId]
      });

      const savedMessage = await newMessage.save();
      console.log(chalk.green.bold(`✓ Message saved (ID: ${savedMessage._id})`));

      // Update both users' chats arrays if not already present
      let updatedSender = false;
      let updatedReceiver = false;

      if (!sender.chats.includes(receiverId)) {
        sender.chats.push(receiverId);
        await sender.save();
        updatedSender = true;
      }

      if (!receiver.chats.includes(senderId)) {
        receiver.chats.push(senderId);
        await receiver.save();
        updatedReceiver = true;
      }

      if (updatedSender || updatedReceiver) {
        console.log(chalk.blue(
          `✓ Chat lists updated | Sender: ${updatedSender} | Receiver: ${updatedReceiver}`
        ));
      }

      console.log(chalk.green.bold("✓ Message sent successfully"));
      console.log(chalk.yellow.bold("=======================\n"));

      res.status(201).json({
        success: true,
        message: "Message sent successfully",
        data: savedMessage
      });

    } catch (error) {
      console.error(chalk.red.bold("✖ Error sending message:"));
      console.error(chalk.red(error.stack));
      res.status(500).json({ 
        success: false,
        message: "Internal server error",
        error: error.message 
      });
    }
  },

  /**
   * @desc    Get all messages grouped by senders from user's chats
   * @route   GET /api/messages
   * @access  Private
   */
  
  getMessagesBySenders: async (req, res) => {
    try {
      const userId = req.user._id;

      // 1. Get the user with populated chats (sender references)
      const user = await User.findById(userId)
        .populate({
          path: 'chats',
          select: 'name photo status lastSeen' // Only get necessary sender fields
        });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // 2. For each chat (sender), get their messages
      const conversations = await Promise.all(
        user.chats.map(async (sender) => {
          // Find all messages between current user and this sender
          const messages = await Chat.find({
            $or: [
              { senderId: userId, receiverId: sender._id }, // Messages sent by me
              { senderId: sender._id, receiverId: userId } // Messages received from sender
            ]
          })
          .sort({ timestamp: -1 }) // Newest first
          .lean();

          // Format messages
          const formattedMessages = messages.map(msg => ({
            ...msg,
            isOwnMessage: msg.senderId.equals(userId)
          }));

          return {
            senderInfo: {
              _id: sender._id,
              name: sender.name,
              photo: sender.photo || sender.photoCloudinary,
              status: sender.status,
              lastSeen: sender.lastSeen
            },
            lastMessage: formattedMessages[0], // Most recent message
            unreadCount: formattedMessages.filter(
              m => !m.isOwnMessage && !m.readBy?.includes(userId)
            ).length,
            messages: formattedMessages
          };
        })
      );

      // 3. Sort conversations by most recent message
      conversations.sort((a, b) => 
        new Date(b.lastMessage?.timestamp || 0) - 
        new Date(a.lastMessage?.timestamp || 0)
      );

      res.status(200).json({
        success: true,
        count: conversations.length,
        data: conversations
      });

    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  /**
   * @desc    Get messages with a specific sender from user's chats
   * @route   GET /api/messages/:senderId
   * @access  Private
   */
  getMessagesWithSender: async (req, res) => {
    try {
      const userId = req.user._id;
      const senderId = req.params.senderId;

      // 1. Verify sender is in user's chats
      const user = await User.findById(userId);
      if (!user.chats.includes(senderId)) {
        return res.status(403).json({
          success: false,
          message: 'You are not connected with this user'
        });
      }

      // 2. Get sender details
      const sender = await User.findById(senderId)
        .select('name photo status lastSeen photoCloudinary');

      if (!sender) {
        return res.status(404).json({
          success: false,
          message: 'Sender not found'
        });
      }

      // 3. Get messages between users
      const messages = await Chat.find({
        $or: [
          { senderId: userId, receiverId: senderId },
          { senderId: senderId, receiverId: userId }
        ]
      })
      .sort({ timestamp: -1 })
      .lean();

      // 4. Format response
      const formattedMessages = messages.map(msg => ({
        ...msg,
        isOwnMessage: msg.senderId.equals(userId)
      }));

      res.status(200).json({
        success: true,
        data: {
          senderInfo: {
            _id: sender._id,
            name: sender.name,
            photo: sender.photo || sender.photoCloudinary,
            status: sender.status,
            lastSeen: sender.lastSeen
          },
          messages: formattedMessages,
          unreadCount: formattedMessages.filter(
            m => !m.isOwnMessage && !m.readBy?.includes(userId)
          ).length
        }
      });

    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
};