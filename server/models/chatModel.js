// import mongoose from "mongoose";

// const ChatSchema = new mongoose.Schema({
//     senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//     receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
//     groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group", default: null },
//     message: String,

//     timestamp: { type: Date, default: Date.now },
//     readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] // Read Receipts
//   });

// export const Chat = mongoose.model('Chat', ChatSchema);
// export default Chat;


import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
  senderId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: true 
  },
  receiverId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
  },
  groupId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Group" 
  },
  message: {
    type: String,
    required: true
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  },
  readBy: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
  }],
  // Additional useful fields
  isGroupChat: {
    type: Boolean,
    default: false
  },
  deletedFor: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }]
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

export const Chat = mongoose.model('Chat', ChatSchema);
export default Chat;