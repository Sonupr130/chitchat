import { create } from "zustand";
import { io } from "socket.io-client";

// export const useChatStore = create((set) => {
//   const socket = io("http://localhost:8000");

//   return {
//     socket,
//     messages: [],
//     setMessages: (messages) => set({ messages }),

//     sendMessage: (senderId, receiverId, message) => {
//       socket.emit("sendMessage", { senderId, receiverId, message });
//       set((state) => ({
//         messages: [...state.messages, { senderId, message }],
//       }));
//     },

//     receiveMessage: () => {
//       socket.on("receiveMessage", (data) => {
//         set((state) => ({
//           messages: [...state.messages, data],
//         }));
//       });
//     },
//   };
// });





export const useChatStore = create((set) => {
  const socket = io("http://localhost:8000");

  return {
    isTyping: false,
    setTyping: (status) => set({ isTyping: status }),

    sendTyping: (senderId, receiverId, groupId) => {
      socket.emit("typing", { senderId, receiverId, groupId });
    },

    receiveTyping: () => {
      socket.on("userTyping", ({ senderId }) => {
        set({ isTyping: true });
        setTimeout(() => set({ isTyping: false }), 2000);
      });
    },
  };
});



// export const useChatStore = create((set) => {
//   const socket = io("http://localhost:5000");

//   return {
//     markAsRead: (messageId, userId) => {
//       socket.emit("messageRead", { messageId, userId });
//     },

//     receiveReadReceipts: () => {
//       socket.on("messageRead", ({ messageId, userId }) => {
//         set((state) => ({
//           messages: state.messages.map(msg =>
//             msg._id === messageId ? { ...msg, readBy: [...msg.readBy, userId] } : msg
//           ),
//         }));
//       });
//     },
//   };
// });
