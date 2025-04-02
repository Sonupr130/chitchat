// import React, { useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import useChatStore from "../store/chatStore.js";
// import { MoreVertical, Paperclip, Phone, Send, Smile, Video } from 'lucide-react';

// const ChatArea = () => {
//   const { chatId } = useParams();
//   const chats = useChatStore((state) => state.chats);
//   const selectedChat = chatId ? chats.find(chat => chat.id === chatId) : null;
  
//   const defaultImage = "https://photosrush.com/wp-content/uploads/no-love-dp-girl-attitude-for-instagram.jpg";

//   useEffect(() => {
//     console.log('Selected chat in ChatArea:', selectedChat);
//   }, [selectedChat]);
  
//   if (!selectedChat) {
//     return (
//       <div className="flex flex-1 items-center justify-center h-full">
//         <p className="text-gray-500 text-sm">Select a chat to start messaging 😒</p>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col h-full flex-1 rounded-lg shadow-sm overflow-hidden relative bg-pink-200">
//       {/* Chat header */}
//       <div className="bg-white p-4 border-b flex items-center justify-between">
//         <div className="flex items-center">
//           <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden flex items-center justify-center">
//             <img
//               src={selectedChat.image || defaultImage}
//               alt="user_image"
//               className="object-cover"
//             />
//           </div>
//           <div className="ml-3">
//             <h2 className="text-sm font-medium">{selectedChat.name}</h2>
//             <p className="text-xs text-green-500">Online</p>
//           </div>
//         </div>
//         <div className="flex items-center space-x-3">
//           <button className="p-2 text-gray-500 hover:bg-gray-100 hover:text-green-500 rounded-full">
//             <Phone size={20} />
//           </button>
//           <button className="p-2 text-gray-500 hover:bg-gray-100 hover:text-green-500 rounded-full">
//             <Video size={20} />
//           </button>
//           <button className="p-2 text-gray-500 hover:bg-gray-100 hover:text-green-500 rounded-full">
//             <MoreVertical size={20} />
//           </button>
//         </div>
//       </div>
      
//       {/* Chat messages area */}
//       <div className="flex-1 overflow-y-auto p-4">
//         {/* You'll render messages here */}
//         {selectedChat.messages ? (
//           selectedChat.messages.map((message, index) => (
//             <div key={index} className={`mb-4 ${message.sender === 'me' ? 'text-right' : ''}`}>
//               <div className={`inline-block p-3 rounded-lg ${
//                 message.sender === 'me' ? 'bg-blue-500 text-white' : 'bg-gray-200'
//               }`}>
//                 {message.text}
//               </div>
//               <div className="text-xs text-gray-500 mt-1">{message.time}</div>
//             </div>
//           ))
//         ) : (
//           <p className="text-center text-gray-500">No messages yet</p>
//         )}
//       </div>
      
//       {/* Message input */}
//       <div className="p-4 border-t border-gray-200 bg-white">
//         <div className="flex items-center w-full relative">
//           <input
//             type="text"
//             placeholder="Type a message..."
//             className="flex-1 border border-gray-300 rounded-full py-2 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           />
//           <div className="absolute right-14 top-1/2 transform -translate-y-1/2 flex gap-2 text-gray-500">
//             <Smile className="w-5 h-5 cursor-pointer hover:text-blue-500" />
//             <Paperclip
//               className="w-5 h-5 cursor-pointer hover:text-blue-500"
//             />
//           </div>
//           <button className="ml-2 p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 focus:outline-none">
//             <Send className="h-5 w-5" />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatArea;









// import React, { useState, useEffect, useRef } from 'react';
// import { useParams } from 'react-router-dom';
// import useChatStore from "../store/chatStore.js";
// import useAuthStore from "../store/authStore.js";
// import { MoreVertical, Paperclip, Phone, Send, Smile, Video } from 'lucide-react';

// const ChatArea = () => {
//   const { chatId } = useParams();
//   const chats = useChatStore((state) => state.chats);
//   const setCurrentChat = useChatStore((state) => state.setCurrentChat);
//   const sendMessage = useChatStore((state) => state.sendMessage);
//   const loadMessages = useChatStore((state) => state.loadMessages);
//   const sendTyping = useChatStore((state) => state.sendTyping);
//   const isTyping = useChatStore((state) => state.isTyping);
//   const connectSocket = useChatStore((state) => state.connectSocket);
  
//   const user = useAuthStore((state) => state.user);
//   const [messageText, setMessageText] = useState('');
//   const [loading, setLoading] = useState(true);
  
//   const messagesEndRef = useRef(null);
//   const selectedChat = chatId ? chats.find(chat => chat.id === chatId) : null;
  
//   const defaultImage = "https://photosrush.com/wp-content/uploads/no-love-dp-girl-attitude-for-instagram.jpg";

//   // Connect socket when component mounts
//   useEffect(() => {
//     if (user && user._id) {
//       connectSocket(user._id);
//     }
//   }, [user, connectSocket]);

//   // Set current active chat and load messages
//   useEffect(() => {
//     if (chatId) {
//       setCurrentChat(chatId);
      
//       // Add immediate check for existing messages
//       const currentChat = chats.find(chat => chat.id === chatId);
//       if (currentChat && currentChat.messages && currentChat.messages.length > 0) {
//         setLoading(false);
//       }
      
//       // Load messages from API
//       loadMessages(chatId)
//         .then(() => {
//           setLoading(false);
//         })
//         .catch(error => {
//           console.error("Error loading messages:", error);
//           setLoading(false); // Set loading to false even on error
//         });
//     }
//   }, [chatId, setCurrentChat, loadMessages, chats]);

//   // Scroll to bottom when messages change
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [selectedChat?.messages]);

//   const handleSendMessage = (e) => {
//     e.preventDefault();
//     if (messageText.trim()) {
//       sendMessage(messageText.trim());
//       setMessageText('');
//     }
//   };

//   const handleTyping = () => {
//     if (selectedChat) {
//       sendTyping(selectedChat.id);
//     }
//   };

//   if (!selectedChat) {
//     return (
//       <div className="flex flex-1 items-center justify-center h-full">
//         <p className="text-gray-500 text-sm">Select a chat to start messaging 😒</p>
//       </div>
//     );
//   }

//   if (loading && (!selectedChat.messages || selectedChat.messages.length === 0)) {
//     return (
//       <div className="flex flex-1 items-center justify-center h-full">
//         <p className="text-gray-500">Loading messages...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col h-full flex-1 rounded-lg shadow-sm overflow-hidden relative bg-gray-50">
//       {/* Chat header */}
//       <div className="bg-white p-4 border-b flex items-center justify-between">
//         <div className="flex items-center">
//           <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden flex items-center justify-center">
//             <img
//               src={selectedChat.image || defaultImage}
//               alt="user_image"
//               className="object-cover h-full w-full"
//             />
//           </div>
//           <div className="ml-3">
//             <h2 className="text-sm font-medium">{selectedChat.name}</h2>
//             <p className="text-xs text-green-500">
//               {isTyping ? "Typing..." : selectedChat.status || "Online"}
//             </p>
//           </div>
//         </div>
//         <div className="flex items-center space-x-3">
//           <button className="p-2 text-gray-500 hover:bg-gray-100 hover:text-green-500 rounded-full">
//             <Phone size={20} />
//           </button>
//           <button className="p-2 text-gray-500 hover:bg-gray-100 hover:text-green-500 rounded-full">
//             <Video size={20} />
//           </button>
//           <button className="p-2 text-gray-500 hover:bg-gray-100 hover:text-green-500 rounded-full">
//             <MoreVertical size={20} />
//           </button>
//         </div>
//       </div>
      
//       {/* Chat messages area */}
//       <div className="flex-1 overflow-y-auto p-4">
//         {selectedChat.messages && selectedChat.messages.length > 0 ? (
//           selectedChat.messages.map((message, index) => {
//             const isMe = message.senderId === user._id;
//             return (
//               <div key={index} className={`mb-4 ${isMe ? 'text-right' : 'text-left'}`}>
//                 <div className={`inline-block p-3 rounded-lg max-w-xs md:max-w-md ${
//                   isMe ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
//                 }`}>
//                   {message.message}
//                 </div>
//                 <div className="text-xs text-gray-500 mt-1">
//                   {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                 </div>
//               </div>
//             );
//           })
//         ) : (
//           <p className="text-center text-gray-500 my-4">Start a conversation</p>
//         )}
//         <div ref={messagesEndRef} />
        
//         {isTyping && (
//           <div className="flex items-center text-sm text-gray-500 italic mb-2">
//             <div className="bg-gray-200 px-3 py-2 rounded-lg">
//               Typing...
//             </div>
//           </div>
//         )}
//       </div>
      
//       {/* Message input */}
//       <div className="p-4 border-t border-gray-200 bg-white">
//         <form onSubmit={handleSendMessage} className="flex items-center w-full relative">
//           <input
//             type="text"
//             placeholder="Type a message..."
//             className="flex-1 border border-gray-300 rounded-full py-2 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             value={messageText}
//             onChange={(e) => setMessageText(e.target.value)}
//             onKeyDown={handleTyping}
//           />
//           <div className="absolute right-14 top-1/2 transform -translate-y-1/2 flex gap-2 text-gray-500">
//             <Smile className="w-5 h-5 cursor-pointer hover:text-blue-500" />
//             <Paperclip className="w-5 h-5 cursor-pointer hover:text-blue-500" />
//           </div>
//           <button 
//             type="submit"
//             className="ml-2 p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 focus:outline-none"
//             disabled={!messageText.trim()}
//           >
//             <Send className="h-5 w-5" />
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ChatArea;










// import React, { useState, useEffect, useRef } from 'react';
// import { useParams } from 'react-router-dom';
// import useChatStore from "../store/chatStore.js";
// import useAuthStore from "../store/authStore.js";
// import { MoreVertical, Paperclip, Phone, Send, Smile, Video } from 'lucide-react';

// const ChatArea = () => {
//   const { chatId } = useParams();
//   const chats = useChatStore((state) => state.chats);
//   const setCurrentChat = useChatStore((state) => state.setCurrentChat);
//   const sendMessage = useChatStore((state) => state.sendMessage);
//   const loadMessages = useChatStore((state) => state.loadMessages);
//   const sendTyping = useChatStore((state) => state.sendTyping);
//   const isTyping = useChatStore((state) => state.isTyping);
//   const connectSocket = useChatStore((state) => state.connectSocket);
//   const getSocket = useChatStore((state) => state.getSocket);
  
//   const user = useAuthStore((state) => state.user);
//   const [messageText, setMessageText] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [isSending, setIsSending] = useState(false);
  
//   const messagesEndRef = useRef(null);
//   const selectedChat = chatId ? chats.find(chat => chat.id === chatId) : null;
  
//   const defaultImage = "https://photosrush.com/wp-content/uploads/no-love-dp-girl-attitude-for-instagram.jpg";

//   // Connect socket when component mounts
//   useEffect(() => {
//     if (user && user._id) {
//       connectSocket(user._id);
//     }
//   }, [user, connectSocket]);

//   // Set current active chat and load messages
//   useEffect(() => {
//     if (chatId) {
//       setCurrentChat(chatId);
      
//       // Add immediate check for existing messages
//       const currentChat = chats.find(chat => chat.id === chatId);
//       if (currentChat && currentChat.messages && currentChat.messages.length > 0) {
//         setLoading(false);
//       }
      
//       // Load messages from API
//       loadMessages(chatId)
//         .then(() => {
//           setLoading(false);
//         })
//         .catch(error => {
//           console.error("Error loading messages:", error);
//           setLoading(false); // Set loading to false even on error
//         });
//     }
//   }, [chatId, setCurrentChat, loadMessages, chats]);

//   // Scroll to bottom when messages change
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [selectedChat?.messages]);

//   const handleSendMessage = async (e) => {
//     e.preventDefault();
    
//     if (!messageText.trim() || !user || !selectedChat) return;
    
//     const trimmedMessage = messageText.trim();
//     setMessageText(''); // Clear input immediately for better UX
//     setIsSending(true);
    
//     try {
//       // Create a temporary message to show instantly
//       const tempMessage = {
//         senderId: user._id,
//         message: trimmedMessage,
//         timestamp: new Date(),
//         readBy: [user._id],
//         pending: true // Mark as pending
//       };
      
//       // Add to UI immediately
//       useChatStore.getState().addMessageToChat(selectedChat.id, tempMessage);
      
//       // Send the actual message
//       await sendMessage(trimmedMessage);
      
//       // Message sent successfully, remove pending state
//       const updatedMessages = selectedChat.messages.map(msg => {
//         if (msg.pending && msg.message === trimmedMessage) {
//           return { ...msg, pending: false };
//         }
//         return msg;
//       });
      
//     } catch (error) {
//       console.error("Failed to send message:", error);
//       // Could add error handling UI here
//     } finally {
//       setIsSending(false);
//     }
//   };

//   const handleTyping = () => {
//     if (selectedChat) {
//       sendTyping(selectedChat.id);
//     }
//   };

//   // Format timestamp
//   const formatTime = (timestamp) => {
//     try {
//       return new Date(timestamp).toLocaleTimeString([], { 
//         hour: '2-digit', 
//         minute: '2-digit' 
//       });
//     } catch (e) {
//       return '';
//     }
//   };

//   if (!selectedChat) {
//     return (
//       <div className="flex flex-1 items-center justify-center h-full">
//         <p className="text-gray-500 text-sm">Select a chat to start messaging 😒</p>
//       </div>
//     );
//   }

//   if (loading && (!selectedChat.messages || selectedChat.messages.length === 0)) {
//     return (
//       <div className="flex flex-1 items-center justify-center h-full">
//         <p className="text-gray-500">Loading messages...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col h-full flex-1 rounded-lg shadow-sm overflow-hidden relative bg-gray-50">
//       {/* Chat header */}
//       <div className="bg-white p-4 border-b flex items-center justify-between">
//         <div className="flex items-center">
//           <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden flex items-center justify-center">
//             <img
//               src={selectedChat.image || defaultImage}
//               alt="user_image"
//               className="object-cover h-full w-full"
//             />
//           </div>
//           <div className="ml-3">
//             <h2 className="text-sm font-medium">{selectedChat.name}</h2>
//             <p className="text-xs text-green-500">
//               {isTyping ? "Typing..." : selectedChat.status || "Online"}
//             </p>
//           </div>
//         </div>
//         <div className="flex items-center space-x-3">
//           <button className="p-2 text-gray-500 hover:bg-gray-100 hover:text-green-500 rounded-full">
//             <Phone size={20} />
//           </button>
//           <button className="p-2 text-gray-500 hover:bg-gray-100 hover:text-green-500 rounded-full">
//             <Video size={20} />
//           </button>
//           <button className="p-2 text-gray-500 hover:bg-gray-100 hover:text-green-500 rounded-full">
//             <MoreVertical size={20} />
//           </button>
//         </div>
//       </div>
      
//       {/* Chat messages area - WhatsApp style */}
//       <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
//         {selectedChat.messages && selectedChat.messages.length > 0 ? (
//           selectedChat.messages.map((message, index) => {
//             const isMe = message.senderId === user._id;
//             const showDate = index === 0 || new Date(message.timestamp).toDateString() !== 
//               new Date(selectedChat.messages[index - 1]?.timestamp).toDateString();
            
//             return (
//               <div key={index} className="mb-4">
//                 {showDate && (
//                   <div className="flex justify-center my-4">
//                     <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
//                       {new Date(message.timestamp).toLocaleDateString()}
//                     </div>
//                   </div>
//                 )}
                
//                 <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
//                   <div className={`relative max-w-xs md:max-w-md ${isMe ? 'order-1' : 'order-2'}`}>
//                     <div className={`p-3 rounded-lg ${
//                       isMe ? 
//                         'bg-green-500 text-white rounded-br-none' : 
//                         'bg-white text-gray-800 rounded-bl-none'
//                     }`}>
//                       {message.message}
//                       <span className="text-xs ml-2 opacity-70">
//                         {formatTime(message.timestamp)}
//                       </span>
                      
//                       {/* Message status indicators (only for sent messages) */}
//                       {isMe && (
//                         <span className="ml-1 text-xs">
//                           {message.pending ? (
//                             <svg className="inline-block w-3 h-3" viewBox="0 0 24 24" fill="currentColor" opacity="0.7">
//                               <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
//                             </svg>
//                           ) : (
//                             <svg className="inline-block w-3 h-3" viewBox="0 0 24 24" fill="currentColor" opacity="0.7">
//                               <path d="M18,7L16.59,5.59L10,12.17L7.41,9.59L6,11L10,15L18,7Z" />
//                             </svg>
//                           )}
//                         </span>
//                       )}
//                     </div>
                    
//                     {/* Chat bubble tail */}
//                     <div className={`absolute -bottom-1 ${isMe ? 'right-0' : 'left-0'}`}>
//                       <svg viewBox="0 0 8 13" width="8" height="13" className={`${
//                         isMe ? 'fill-green-500' : 'fill-white'
//                       }`}>
//                         {isMe ? (
//                           <path d="M1.533 3.568L8 12.193V1H2.812C1.042 1 .474 2.156 1.533 3.568z" />
//                         ) : (
//                           <path d="M6.467 3.568L0 12.193V1H5.188C6.958 1 7.526 2.156 6.467 3.568z" />
//                         )}
//                       </svg>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             );
//           })
//         ) : (
//           <div className="flex flex-col items-center justify-center h-64">
//             <div className="text-gray-400 mb-2">
//               <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
//                 <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
//               </svg>
//             </div>
//             <p className="text-center text-gray-500">No messages yet</p>
//             <p className="text-center text-gray-400 text-sm mt-1">Start a conversation with {selectedChat.name}</p>
//           </div>
//         )}
//         <div ref={messagesEndRef} />
        
//         {isTyping && (
//           <div className="flex items-center text-sm text-gray-500 italic mb-2">
//             <div className="bg-white px-3 py-2 rounded-lg rounded-bl-none relative">
//               <div className="flex space-x-1">
//                 <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
//                 <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
//                 <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
//               </div>
//               <div className="absolute -bottom-1 left-0">
//                 <svg viewBox="0 0 8 13" width="8" height="13" className="fill-white">
//                   <path d="M6.467 3.568L0 12.193V1H5.188C6.958 1 7.526 2.156 6.467 3.568z" />
//                 </svg>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
      
//       {/* Message input */}
//       <div className="p-3 border-t border-gray-200 bg-white">
//         <form onSubmit={handleSendMessage} className="flex items-center w-full relative">
//           <input
//             type="text"
//             placeholder="Type a message..."
//             className="flex-1 border border-gray-300 rounded-full py-2 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             value={messageText}
//             onChange={(e) => setMessageText(e.target.value)}
//             onKeyDown={handleTyping}
//             disabled={isSending}
//           />
//           <div className="absolute right-14 top-1/2 transform -translate-y-1/2 flex gap-2 text-gray-500">
//             <Smile className="w-5 h-5 cursor-pointer hover:text-blue-500" />
//             <Paperclip className="w-5 h-5 cursor-pointer hover:text-blue-500" />
//           </div>
//           <button 
//             type="submit"
//             className={`ml-2 p-2 rounded-full ${
//               messageText.trim() ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-300'
//             } text-white focus:outline-none transition-colors`}
//             disabled={!messageText.trim() || isSending}
//           >
//             <Send className="h-5 w-5" />
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ChatArea;



















import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import useChatStore from "../store/chatStore.js";
import useAuthStore from "../store/authStore.js";
import { MoreVertical, Paperclip, Phone, Send, Smile, Video } from 'lucide-react';

const ChatArea = () => {
  const { chatId } = useParams();
  const chats = useChatStore((state) => state.chats);
  const setCurrentChat = useChatStore((state) => state.setCurrentChat);
  const sendMessage = useChatStore((state) => state.sendMessage);
  const loadMessages = useChatStore((state) => state.loadMessages);
  const sendTyping = useChatStore((state) => state.sendTyping);
  const isTyping = useChatStore((state) => state.isTyping);
  const connectSocket = useChatStore((state) => state.connectSocket);
  const getSocket = useChatStore((state) => state.getSocket);
  
  const user = useAuthStore((state) => state.user);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  
  const messagesEndRef = useRef(null);
  const selectedChat = chatId ? chats.find(chat => chat.id === chatId) : null;
  
  const defaultImage = "https://photosrush.com/wp-content/uploads/no-love-dp-girl-attitude-for-instagram.jpg";

  // Connect socket when component mounts
  useEffect(() => {
    if (user && user._id) {
      connectSocket(user._id);
    }
  }, [user, connectSocket]);

  // Set current active chat and load messages
  useEffect(() => {
    if (chatId) {
      setCurrentChat(chatId);
      
      // Add immediate check for existing messages
      const currentChat = chats.find(chat => chat.id === chatId);
      if (currentChat && currentChat.messages && currentChat.messages.length > 0) {
        setLoading(false);
      }
      
      // Load messages from API
      loadMessages(chatId)
        .then(() => {
          setLoading(false);
        })
        .catch(error => {
          console.error("Error loading messages:", error);
          setLoading(false); // Set loading to false even on error
        });
    }
  }, [chatId, setCurrentChat, loadMessages, chats]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedChat?.messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!messageText.trim() || !user || !selectedChat) return;
    
    const trimmedMessage = messageText.trim();
    setMessageText(''); // Clear input immediately for better UX
    setIsSending(true);
    
    try {
      // Create a temporary message to show instantly in UI
      const tempMessage = {
        senderId: user._id,
        message: trimmedMessage,
        timestamp: new Date(),
        readBy: [user._id],
        pending: true // Mark as pending
      };
      
      // Add to UI immediately
      useChatStore.getState().addMessageToChat(selectedChat.id, tempMessage);
      
      // Send the actual message to database via API
      await sendMessage(trimmedMessage);
      
      // No need to manually update messages here, as the server response
      // should trigger an update via socket or the sendMessage function
      
    } catch (error) {
      console.error("Failed to send message:", error);
      // Handle error - could add visual indicator for failed messages
    } finally {
      setIsSending(false);
    }
  };

  const handleTyping = () => {
    if (selectedChat) {
      sendTyping(selectedChat.id);
    }
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    try {
      return new Date(timestamp).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch (e) {
      return '';
    }
  };

  if (!selectedChat) {
    return (
      <div className="flex flex-1 items-center justify-center h-full">
        <p className="text-gray-500 text-sm">Select a chat to start messaging 😒</p>
      </div>
    );
  }

  if (loading && (!selectedChat.messages || selectedChat.messages.length === 0)) {
    return (
      <div className="flex flex-1 items-center justify-center h-full">
        <p className="text-gray-500">Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full flex-1 rounded-lg shadow-sm overflow-hidden relative bg-gray-50">
      {/* Chat header */}
      <div className="bg-white p-4 border-b flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden flex items-center justify-center">
            <img
              src={selectedChat.image || defaultImage}
              alt="user_image"
              className="object-cover h-full w-full"
            />
          </div>
          <div className="ml-3">
            <h2 className="text-sm font-medium">{selectedChat.name}</h2>
            <p className="text-xs text-green-500">
              {isTyping ? "Typing..." : selectedChat.status || "Online"}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button className="p-2 text-gray-500 hover:bg-gray-100 hover:text-green-500 rounded-full">
            <Phone size={20} />
          </button>
          <button className="p-2 text-gray-500 hover:bg-gray-100 hover:text-green-500 rounded-full">
            <Video size={20} />
          </button>
          <button className="p-2 text-gray-500 hover:bg-gray-100 hover:text-green-500 rounded-full">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>
      
      {/* Chat messages area - WhatsApp style */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
        {selectedChat.messages && selectedChat.messages.length > 0 ? (
          selectedChat.messages.map((message, index) => {
            const isMe = message.senderId === user._id;
            const showDate = index === 0 || new Date(message.timestamp).toDateString() !== 
              new Date(selectedChat.messages[index - 1]?.timestamp).toDateString();
            
            return (
              <div key={index} className="mb-4">
                {showDate && (
                  <div className="flex justify-center my-4">
                    <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                      {new Date(message.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                )}
                
                <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`relative max-w-xs md:max-w-md ${isMe ? 'order-1' : 'order-2'}`}>
                    <div className={`p-3 rounded-lg ${
                      isMe ? 
                        'bg-green-500 text-white rounded-br-none' : 
                        'bg-white text-gray-800 rounded-bl-none'
                    }`}>
                      {message.message}
                      <span className="text-xs ml-2 opacity-70">
                        {formatTime(message.timestamp)}
                      </span>
                      
                      {/* Message status indicators (only for sent messages) */}
                      {isMe && (
                        <span className="ml-1 text-xs">
                          {message.pending ? (
                            <svg className="inline-block w-3 h-3" viewBox="0 0 24 24" fill="currentColor" opacity="0.7">
                              <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
                            </svg>
                          ) : (
                            <svg className="inline-block w-3 h-3" viewBox="0 0 24 24" fill="currentColor" opacity="0.7">
                              <path d="M18,7L16.59,5.59L10,12.17L7.41,9.59L6,11L10,15L18,7Z" />
                            </svg>
                          )}
                        </span>
                      )}
                    </div>
                    
                    {/* Chat bubble tail */}
                    <div className={`absolute -bottom-1 ${isMe ? 'right-0' : 'left-0'}`}>
                      <svg viewBox="0 0 8 13" width="8" height="13" className={`${
                        isMe ? 'fill-green-500' : 'fill-white'
                      }`}>
                        {isMe ? (
                          <path d="M1.533 3.568L8 12.193V1H2.812C1.042 1 .474 2.156 1.533 3.568z" />
                        ) : (
                          <path d="M6.467 3.568L0 12.193V1H5.188C6.958 1 7.526 2.156 6.467 3.568z" />
                        )}
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="text-gray-400 mb-2">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <p className="text-center text-gray-500">No messages yet</p>
            <p className="text-center text-gray-400 text-sm mt-1">Start a conversation with {selectedChat.name}</p>
          </div>
        )}
        <div ref={messagesEndRef} />
        
        {isTyping && (
          <div className="flex items-center text-sm text-gray-500 italic mb-2">
            <div className="bg-white px-3 py-2 rounded-lg rounded-bl-none relative">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
              </div>
              <div className="absolute -bottom-1 left-0">
                <svg viewBox="0 0 8 13" width="8" height="13" className="fill-white">
                  <path d="M6.467 3.568L0 12.193V1H5.188C6.958 1 7.526 2.156 6.467 3.568z" />
                </svg>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Message input */}
      <div className="p-3 border-t border-gray-200 bg-white">
        <form onSubmit={handleSendMessage} className="flex items-center w-full relative">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 border border-gray-300 rounded-full py-2 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={handleTyping}
            disabled={isSending}
          />
          <div className="absolute right-14 top-1/2 transform -translate-y-1/2 flex gap-2 text-gray-500">
            <Smile className="w-5 h-5 cursor-pointer hover:text-blue-500" />
            <Paperclip className="w-5 h-5 cursor-pointer hover:text-blue-500" />
          </div>
          <button 
            type="submit"
            className={`ml-2 p-2 rounded-full ${
              messageText.trim() ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-300'
            } text-white focus:outline-none transition-colors`}
            disabled={!messageText.trim() || isSending}
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatArea;