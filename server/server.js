import express from "express";
import dbConnect from "./config/db.js";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http"; // Import HTTP module
import { Server } from "socket.io"; // Import Socket.io
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const server = createServer(app); // Create an HTTP server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Adjust based on your frontend URL
    methods: ["GET", "POST"],
  },
});

dbConnect();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);

// SOCKET.IO IMPLEMENTATION 👇
const users = {}; // Store online users

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("join", (userId) => {
    users[userId] = socket.id;
    console.log(`${userId} joined`);
  });

  // Handle private & group messages
  socket.on("sendMessage", ({ senderId, receiverId, groupId, message }) => {
    if (groupId) {
      io.emit(`group-${groupId}`, { senderId, message });
    } else {
      const receiverSocketId = users[receiverId];
      if (receiverSocketId)
        io.to(receiverSocketId).emit("receiveMessage", { senderId, message });
    }
  });

  // Add real-time "User is typing..." feature
  socket.on("typing", ({ senderId, receiverId, groupId }) => {
    if (groupId) io.emit(`group-typing-${groupId}`, { senderId });
    else io.to(users[receiverId]).emit("userTyping", { senderId });
  });

  // Show "Seen" when a message is read.
  socket.on("messageRead", ({ messageId, userId }) => {
    Chat.findByIdAndUpdate(messageId, { $addToSet: { readBy: userId } }).then(() =>
      io.emit("messageRead", { messageId, userId })
    );
  });

  // Disconnect user
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    for (let user in users) {
      if (users[user] === socket.id) delete users[user];
    }
  });
});

// Use server.listen instead of app.listen
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
