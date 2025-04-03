import Chat from "../models/chatModel.js";
import User from "../models/userModel.js";
import mongoose from "mongoose";
import chalk from "chalk";

export const sendMessage = async (req, res) => {
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
};






export const getMessages = async (req, res) => {
  try {
    const { senderId, receiverId } = req.query;

    console.log(chalk.yellow.bold("\n=== Fetch Messages Request ==="));
    console.log(chalk.cyan(`Between: ${senderId} ↔ ${receiverId}`));

    // Validate input
    if (!mongoose.Types.ObjectId.isValid(senderId) || 
        !mongoose.Types.ObjectId.isValid(receiverId)) {
      console.log(chalk.red.bold("✖ Invalid user IDs"));
      return res.status(400).json({ 
        success: false,
        message: "Invalid user IDs" 
      });
    }

    // Find messages between these users in either direction
    const messages = await Chat.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId }
      ]
    }).sort({ timestamp: 1 });

    console.log(chalk.green(`✓ Found ${messages.length} messages`));
    console.log(chalk.yellow.bold("=======================\n"));

    res.status(200).json({
      success: true,
      data: messages
    });

  } catch (error) {
    console.error(chalk.red.bold("✖ Error fetching messages:"));
    console.error(chalk.red(error.stack));
    res.status(500).json({ 
      success: false,
      message: "Internal server error",
      error: error.message 
    });
  }
};

