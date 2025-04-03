import express from "express";
import dbConnect from "./config/db.js";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http"; 
import { Server } from "socket.io"; 
import cookieParser from 'cookie-parser';
import chalk from "chalk";
import Chat from "./models/chatModel.js";

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Database connection with chalk logging
dbConnect().then(() => {
  console.log(chalk.green.bold("✓ Database connected successfully"));
}).catch(err => {
  console.error(chalk.red.bold("✖ Database connection failed:"));
  console.error(chalk.red(err.stack));
  process.exit(1);
});

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

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ 
    status: "healthy",
    timestamp: new Date().toISOString() 
  });
});

// Enhanced Socket.IO Implementation
const users = {}; // Store online users: { userId: socketId }

io.on("connection", (socket) => {
  console.log(chalk.yellow.bold("\n=== New Socket Connection ==="));
  console.log(chalk.cyan(`Socket ID: ${socket.id}`));
  console.log(chalk.cyan(`Total connections: ${io.engine.clientsCount}`));

  // User joins the application
  socket.on("join", (userId) => {
    if (!userId) {
      console.log(chalk.red("✖ Join attempt without userId"));
      return;
    }

    users[userId] = socket.id;
    console.log(chalk.green(`✓ User joined: ${userId}`));
    console.log(chalk.blue(`Active users: ${Object.keys(users).length}`));

    // Notify others about user's online status
    socket.broadcast.emit("user-online", { userId });
  });

  // Handle private & group messages
  socket.on("sendMessage", async ({ senderId, receiverId, groupId, message }) => {
    console.log(chalk.yellow.bold("\n=== New Message ==="));
    console.log(chalk.cyan(`Sender: ${senderId}`));
    console.log(chalk.cyan(`Receiver: ${receiverId || 'Group: ' + groupId}`));
    console.log(chalk.cyan(`Message: ${message.substring(0, 30)}...`));

    try {
      if (groupId) {
        // Group message handling
        io.emit(`group-${groupId}`, { senderId, message });
        console.log(chalk.green(`✓ Group message sent to group ${groupId}`));
      } else {
        // Private message handling
        const receiverSocketId = users[receiverId];
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("receiveMessage", { senderId, message });
          console.log(chalk.green(`✓ Private message delivered to ${receiverId}`));
        } else {
          console.log(chalk.yellow(`⚠ User ${receiverId} is offline`));
          // You might want to store offline messages here
        }
      }
    } catch (error) {
      console.error(chalk.red.bold("✖ Message delivery error:"));
      console.error(chalk.red(error.stack));
    }
  });

  // Typing indicators
  socket.on("typing", ({ senderId, receiverId, groupId }) => {
    console.log(chalk.magenta(`Typing: ${senderId} is typing...`));
    
    if (groupId) {
      io.emit(`group-typing-${groupId}`, { senderId });
    } else if (receiverId && users[receiverId]) {
      io.to(users[receiverId]).emit("userTyping", { senderId });
    }
  });

  // Message read receipts
  socket.on("messageRead", async ({ messageId, userId }) => {
    console.log(chalk.blue(`Message read: ${messageId} by ${userId}`));
    
    try {
      const updatedMessage = await Chat.findByIdAndUpdate(
        messageId,
        { $addToSet: { readBy: userId } },
        { new: true }
      );
      
      if (updatedMessage) {
        io.emit("messageRead", { messageId, userId });
      }
    } catch (error) {
      console.error(chalk.red.bold("✖ Error updating read status:"));
      console.error(chalk.red(error.stack));
    }
  });

  // Disconnection handler
  socket.on("disconnect", () => {
    console.log(chalk.yellow.bold("\n=== Socket Disconnected ==="));
    console.log(chalk.cyan(`Disconnected ID: ${socket.id}`));

    // Find and remove the disconnected user
    for (let userId in users) {
      if (users[userId] === socket.id) {
        console.log(chalk.red(`✖ User offline: ${userId}`));
        delete users[userId];
        
        // Notify others about user's offline status
        socket.broadcast.emit("user-offline", { userId });
        break;
      }
    }

    console.log(chalk.blue(`Remaining connections: ${Object.keys(users).length}`));
  });
});

// Server startup
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(chalk.green.bold("\n=== Server Started ==="));
  console.log(chalk.cyan(`Mode: ${process.env.NODE_ENV || 'development'}`));
  console.log(chalk.cyan(`Port: ${PORT}`));
  console.log(chalk.cyan(`URL: http://localhost:${PORT}`));
  console.log(chalk.green.bold("=======================\n"));
});

// Error handling
process.on("unhandledRejection", (err) => {
  console.error(chalk.red.bold("✖ Unhandled Rejection:"));
  console.error(chalk.red(err.stack));
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error(chalk.red.bold("✖ Uncaught Exception:"));
  console.error(chalk.red(err.stack));
  process.exit(1);
});