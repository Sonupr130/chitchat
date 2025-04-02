import { create } from "zustand";
import { persist } from "zustand/middleware";
import { io } from "socket.io-client";

// Create socket outside of the persisted store
const socket = io("http://localhost:8000");

const useChatStore = create(
  persist(
    (set, get) => ({
      // Don't include socket in the persisted state
      chats: [
        {
          id: "67eab8059663d0ac4e7d44f2",
          name: "Sonu Pradhan",
          status: "Available",
          lastMessage: "Welcome, Sonu Pradhan",
          time: "",
          unread: false,
          messages: []
        }
      ],
      currentChat: null,
      isTyping: false,
      
      // Connect socket when user logs in
      connectSocket: (userId) => {
        if (userId) {
          socket.emit("join", userId);
          console.log("Connected to socket with userId:", userId);
          
          // Set up listeners
          socket.on("receiveMessage", (data) => {
            console.log("Received message:", data);
            get().addMessageToChat(data.receiverId, {
              senderId: data.senderId,
              message: data.message,
              timestamp: new Date(),
              readBy: [data.senderId]
            });
          });
          
          socket.on("userTyping", ({senderId}) => {
            set({ isTyping: true });
            setTimeout(() => set({ isTyping: false }), 2000);
          });
        }
      },
      
      // Add a new chat with a user
      addChat: (friend) => set((state) => {
        // Check if chat already exists
        if (state.chats.some(chat => chat.id === friend._id)) {
          return state;
        }
        
        const newChat = {
          id: friend._id,
          name: friend.name,
          status: friend.status || "Online",
          lastMessage: friend.lastMessage || `Started chatting with ${friend.name}`,
          time: friend.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          unread: false,
          image: friend.photoCloudinary || friend.photo,
          messages: []
        };
        
        return { chats: [...state.chats, newChat] };
      }),
      
      // Set current active chat
      setCurrentChat: (chatId) => set((state) => {
        const chat = state.chats.find(c => c.id === chatId);
        return { currentChat: chat };
      }),
      
      // Send a message
      sendMessage: (message) => {
        const { currentChat } = get();
        const currentUser = JSON.parse(localStorage.getItem('auth-storage')).state.user;
        
        if (!currentChat || !currentUser) return;
        
        const messageData = {
          senderId: currentUser._id,
          receiverId: currentChat.id,
          message: message
        };
        
        // Emit to socket
        socket.emit("sendMessage", messageData);
        
        // Send to API
        fetch("http://localhost:8000/api/chat/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(messageData)
        })
        .then(res => res.json())
        .then(data => {
          console.log("Message saved:", data);
          // Update local state
          get().addMessageToChat(currentChat.id, {
            senderId: currentUser._id, 
            message: message,
            timestamp: new Date(),
            readBy: [currentUser._id]
          });
        })
        .catch(err => console.error("Error sending message:", err));
      },
      
      // Add message to a specific chat
      addMessageToChat: (chatId, messageData) => set((state) => {
        const newChats = state.chats.map(chat => {
          if (chat.id === chatId) {
            const updatedChat = {
              ...chat,
              lastMessage: messageData.message,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              messages: [...(chat.messages || []), messageData]
            };
            return updatedChat;
          }
          return chat;
        });
        
        return { 
          chats: newChats,
          currentChat: state.currentChat?.id === chatId ? 
            newChats.find(c => c.id === chatId) : state.currentChat
        };
      }),
      
      // Load messages for a chat
      loadMessages: async (chatId) => {
        const currentUser = JSON.parse(localStorage.getItem('auth-storage')).state.user;
        if (!currentUser) return;
        
        try {
          const response = await fetch(`http://localhost:8000/api/chat/messages?senderId=${currentUser._id}&receiverId=${chatId}`);
          const messages = await response.json();
          
          set((state) => ({
            chats: state.chats.map(chat => {
              if (chat.id === chatId) {
                return {
                  ...chat,
                  messages: messages.map(msg => ({
                    senderId: msg.senderId,
                    message: msg.message,
                    timestamp: msg.timestamp,
                    readBy: msg.readBy || []
                  }))
                };
              }
              return chat;
            })
          }));
        } catch (error) {
          console.error("Error loading messages:", error);
        }
      },
      
      // User is typing
      sendTyping: (receiverId) => {
        const currentUser = JSON.parse(localStorage.getItem('auth-storage')).state.user;
        if (currentUser && receiverId) {
          socket.emit("typing", { 
            senderId: currentUser._id, 
            receiverId 
          });
        }
      },
      
      // Helper method to get socket (since it's no longer in state)
      getSocket: () => socket
    }),
    {
      name: 'chat-storage',
      getStorage: () => localStorage,
      // Define custom serialization to exclude socket from being stored
      serialize: (state) => {
        // Create a copy without socket property
        const { socket, ...storableState } = state;
        return JSON.stringify(storableState);
      },
      // Only include specific fields to persist
      partialize: (state) => ({
        chats: state.chats,
        currentChat: state.currentChat,
        isTyping: state.isTyping,
      }),
    }
  )
);

export default useChatStore;