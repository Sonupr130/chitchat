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
  
  const user = useAuthStore((state) => state.user);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  
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

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageText.trim()) {
      sendMessage(messageText.trim());
      setMessageText('');
    }
  };

  const handleTyping = () => {
    if (selectedChat) {
      sendTyping(selectedChat.id);
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
      
      {/* Chat messages area */}
      <div className="flex-1 overflow-y-auto p-4">
        {selectedChat.messages && selectedChat.messages.length > 0 ? (
          selectedChat.messages.map((message, index) => {
            const isMe = message.senderId === user._id;
            return (
              <div key={index} className={`mb-4 ${isMe ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block p-3 rounded-lg max-w-xs md:max-w-md ${
                  isMe ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                }`}>
                  {message.message}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500 my-4">Start a conversation</p>
        )}
        <div ref={messagesEndRef} />
        
        {isTyping && (
          <div className="flex items-center text-sm text-gray-500 italic mb-2">
            <div className="bg-gray-200 px-3 py-2 rounded-lg">
              Typing...
            </div>
          </div>
        )}
      </div>
      
      {/* Message input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <form onSubmit={handleSendMessage} className="flex items-center w-full relative">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 border border-gray-300 rounded-full py-2 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={handleTyping}
          />
          <div className="absolute right-14 top-1/2 transform -translate-y-1/2 flex gap-2 text-gray-500">
            <Smile className="w-5 h-5 cursor-pointer hover:text-blue-500" />
            <Paperclip className="w-5 h-5 cursor-pointer hover:text-blue-500" />
          </div>
          <button 
            type="submit"
            className="ml-2 p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 focus:outline-none"
            disabled={!messageText.trim()}
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatArea;