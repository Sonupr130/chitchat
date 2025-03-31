import Chat from "../models/chatModel.js";

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