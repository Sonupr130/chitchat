import { create } from "zustand";
import { persist } from "zustand/middleware"; // Import from middleware
import { io } from "socket.io-client";

const useChatStore = create(
  persist(
    (set) => ({
      chats: [
        {
          id: 1,
          name: "Sonu Pradhan",
          status: "Available",
          lastMessage: "Welcome, Sonu Pradhan",
          time: "",
          unread: false,
        }
      ],
      addChat: (friend) => set((state) => {
        // Check if chat already exists
        if (state.chats.some(chat => chat.id === friend.id)) {
          return state;
        }
        
        const newChat = {
          id: friend.id,
          name: friend.name,
          status: friend.status || "Online",
          lastMessage: friend.lastMessage || `Started chatting with ${friend.name}`,
          time: friend.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          unread: false,
          image: friend.photo || friend.image
        };
        
        return { chats: [...state.chats, newChat] };
      }),
    }),
    {
      name: 'chat-storage', // unique name for localStorage
      getStorage: () => localStorage, // explicitly specify storage
    }
  )
);

export default useChatStore;




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





// export const useChatStore = create((set) => {
//   const socket = io("http://localhost:8000");

//   return {
//     isTyping: false,
//     setTyping: (status) => set({ isTyping: status }),

//     sendTyping: (senderId, receiverId, groupId) => {
//       socket.emit("typing", { senderId, receiverId, groupId });
//     },

//     receiveTyping: () => {
//       socket.on("userTyping", ({ senderId }) => {
//         set({ isTyping: true });
//         setTimeout(() => set({ isTyping: false }), 2000);
//       });
//     },
//   };
// });



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
