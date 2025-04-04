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

       setChats: (newChats) => set({ chats: newChats }),
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
          
          // Add message read receipt listener
          socket.on("messageRead", ({messageId, userId}) => {
            // Update read status for messages
            const { currentChat } = get();
            if (currentChat) {
              set((state) => ({
                chats: state.chats.map(chat => {
                  if (chat.id === currentChat.id) {
                    return {
                      ...chat,
                      messages: chat.messages.map(msg => {
                        // If there's a way to match the message with messageId, update it
                        // For now, we'll just mark any unread message as read
                        if (!msg.readBy.includes(userId)) {
                          return {
                            ...msg,
                            readBy: [...msg.readBy, userId]
                          };
                        }
                        return msg;
                      })
                    };
                  }
                  return chat;
                })
              }));
            }
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
      sendMessage: async (message) => {
        const { currentChat } = get();
        const currentUser = JSON.parse(localStorage.getItem('auth-storage')).state.user;
        
        if (!currentChat || !currentUser) return;
        
        const messageData = {
          senderId: currentUser._id,
          receiverId: currentChat.id,
          message: message
        };
        
        // Emit to socket for real-time communication
        socket.emit("sendMessage", messageData);
        
        try {
          // Send to API to store in database
          const response = await fetch("http://localhost:8000/api/chat/sends", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${JSON.parse(localStorage.getItem('auth-storage')).state.token}`
            },
            body: JSON.stringify(messageData)
          });
          console.log("user response from chat store",response)
          
          if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
          }
          
          const data = await response.json();
          console.log("Message saved to database:", data);
          
          // Verify the chat was added to the user's chats
          const userResponse = await fetch(`http://localhost:8000/api/chat/${currentUser._id}`, {
            headers: {
              "Authorization": `Bearer ${JSON.parse(localStorage.getItem('auth-storage')).state.token}`
            }
          });
          console.log("user response in chat store",userResponse)
          
          if (userResponse.ok) {
            const updatedUser = await userResponse.json();
            // You might want to update your local user state here if needed
          }
          
          // Update local state with the confirmed message from the server
          get().addMessageToChat(currentChat.id, {
            senderId: currentUser._id, 
            message: message,
            timestamp: data.timestamp || new Date(),
            readBy: data.readBy || [currentUser._id],
            _id: data._id // Store the database ID for reference
          });
          
          return data;
        } catch (err) {
          console.error("Error sending message:", err);
          throw err;
        }
      },
      
      // Add message to a specific chat
      addMessageToChat: (chatId, messageData) => set((state) => {
        const newChats = state.chats.map(chat => {
          if (chat.id === chatId) {
            // Find if this message already exists (for pending -> confirmed updates)
            const messageExists = chat.messages.some(msg => 
              msg.pending && msg.message === messageData.message && 
              msg.senderId === messageData.senderId
            );
            
            // If pending message exists, update it; otherwise add new message
            const updatedMessages = messageExists 
              ? chat.messages.map(msg => {
                  if (msg.pending && msg.message === messageData.message && 
                      msg.senderId === messageData.senderId) {
                    return { ...messageData, pending: false };
                  }
                  return msg;
                })
              : [...(chat.messages || []), messageData];
            
            const updatedChat = {
              ...chat,
              lastMessage: messageData.message,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              messages: updatedMessages
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
      
      // Load messages for a chat from database
      loadMessages: async (chatId) => {
        const currentUser = JSON.parse(localStorage.getItem('auth-storage')).state.user;
        if (!currentUser) return;
        
        try {
          const response = await fetch(`http://localhost:8000/api/chat/messages?senderId=${currentUser._id}&receiverId=${chatId}`, {
            headers: {
              // Add authorization if required by your API
              "Authorization": `Bearer ${JSON.parse(localStorage.getItem('auth-storage')).state.token}`
            }
          });
          
          if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
          }
          
          const messages = await response.json();
          
          // Update local chat messages with server data
          set((state) => ({
            chats: state.chats.map(chat => {
              if (chat.id === chatId) {
                return {
                  ...chat,
                  messages: messages.map(msg => ({
                    _id: msg._id, // Store the database ID
                    senderId: msg.senderId,
                    message: msg.message,
                    timestamp: msg.timestamp || msg.createdAt || new Date(),
                    readBy: msg.readBy || []
                  }))
                };
              }
              return chat;
            })
          }));
          
          return messages;
        } catch (error) {
          console.error("Error loading messages:", error);
          throw error;
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
      
      // Mark message as read
      markMessageAsRead: (messageId) => {
        const currentUser = JSON.parse(localStorage.getItem('auth-storage')).state.user;
        if (currentUser && messageId) {
          socket.emit("messageRead", {
            messageId,
            userId: currentUser._id
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













