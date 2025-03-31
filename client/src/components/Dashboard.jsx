import React, { useState, useRef } from "react";
import logo from "../assets/logo.png";
import chatBackground from "../assets/whatsapp-bg.jpg";
import {
  CircleDashed,
  Droplet,
  House,
  LogOut,
  MessageCircle,
  Plus,
  Search,
  Moon,
  Sun,
  Paperclip,
  Image as ImageIcon,
  FileText,
  Smile,
  Mic,
  SendHorizonal,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { useNavigate } from "react-router-dom";
import useUserStore from "../store/userStore.js";
import { auth } from "../config/firebase.js";
import Chat from "./Chat.jsx";

const Dashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const fileInputRef = useRef(null);

  // const user = useUserStore((state) => state.user);
  // console.log(user);
  // const navigate = useNavigate();

  // if (!user) {
  //   navigate("/");
  //   return null;
  // }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const chatList = [
    {
      id: 1,
      name: "Aarav Sharma",
      message: "Hey, are we still meeting tomorrow?",
      time: "9:15 AM",
      avatar: "https://i.pinimg.com/736x/84/3e/5b/843e5b0864071ade626c3c93c549909f.jpg",
      unread: false
    },
    {
      id: 2,
      name: "Priya Chettri",
      message: "Please review the documents I sent",
      time: "10:30 AM",
      avatar: "https://i.pinimg.com/736x/65/be/98/65be9880275db3afc6079f2075db5efd.jpg",
      unread: true
    },
    {
      id: 3,
      name: "Rahul Gupta",
      message: "Did you get my last message?",
      time: "11:45 AM",
      avatar: "https://i.pinimg.com/736x/72/e2/08/72e2081e72d6c2958036726ef03bf98f.jpg",
      unread: false
    },
  ];

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    if (chat.name === "Priya Chettri") {
      setMessages([
        {
          sender: chat.name,
          text: "Please review the documents I sent",
          time: "10:30 AM",
          type: "text",
        },
        {
          sender: chat.name,
          text: "project-specs.pdf",
          time: "10:31 AM",
          type: "document",
          fileType: "pdf",
          size: "2.4 MB",
        },
        {
          sender: chat.name,
          text: "design-mockup.jpg",
          time: "10:32 AM",
          type: "image",
          url: "https://i.pinimg.com/736x/b8/f4/4d/b8f44d323752475ead78d666689b54e4.jpg",
        },
        {
          sender: "You",
          text: "I'll review them and get back to you",
          time: "10:35 AM",
          type: "text",
        },
        {
          sender: chat.name,
          text: "Here's the updated budget sheet",
          time: "10:36 AM",
          type: "document",
          fileType: "xlsx",
          size: "1.8 MB",
        },
      ]);
    } else {
      setMessages([
        { sender: chat.name, text: chat.message, time: chat.time, type: "text" },
        { sender: "You", text: "Thanks for your message!", time: "Just now", type: "text" },
      ]);
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, {
        sender: "You",
        text: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: "text"
      }]);
      setNewMessage("");
    }
  };

  const handleFileUpload = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      const newFiles = Array.from(files).map(file => ({
        sender: "You",
        text: file.name,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: file.type.startsWith("image/") ? "image" : "document",
        fileType: file.name.split('.').pop(),
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        file
      }));
      setMessages([...messages, ...newFiles]);
    }
  };


  // const setUser = useUserStore((state) => state.setUser);

  const handleLogout = () => {
    auth.signOut();
    setUser(null);
    navigate("/");
  };


  return (
    <div className={`h-screen w-screen flex ${darkMode ? 'bg-gray-900 text-white' : 'bg-[#f9f7fd] text-gray-800'} overflow-hidden transition-colors duration-300`}>
      {/* SIDEBAR NAVIGATION */}
      <div className={`flex flex-col items-center justify-between py-10 w-[8vw] ${darkMode ? 'bg-gray-800' : 'bg-[#f9f7fd]'}`}>
        {/* Logo */}
        <div className="w-16 h-16 flex items-center justify-center">
          <img src={logo} alt="logo" className="w-full h-full object-contain" />
        </div>

        {/* Navigation Icons */}
        <div className={`flex flex-col items-center gap-7 w-[70%] rounded-xl py-6 ${darkMode ? 'bg-gray-700' : 'bg-white shadow-lg'}`}>
          <a href="#" className={`${darkMode ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-800 hover:text-indigo-600'} transition-colors`}>
            <House size={20} />
          </a>
          <a href="#" className={`relative ${darkMode ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-800 hover:text-indigo-600'} transition-colors`}>
            <MessageCircle size={20} />
            <span className="absolute top-1 -right-1 block h-2 w-2 bg-green-500 rounded-full ring-2 ring-white"></span>
          </a>
          <a href="#" className={`${darkMode ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-800 hover:text-indigo-600'} transition-colors`}>
            <CircleDashed size={20} />
          </a>
          <a href="#" className={`${darkMode ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-800 hover:text-indigo-600'} transition-colors`}>
            <Droplet size={20} />
          </a>
          <a href="#" className={`${darkMode ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-800 hover:text-indigo-600'} transition-colors`}>
            <Search size={20} />
          </a>
          <a href="#" className={`${darkMode ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-800 hover:text-indigo-600'} transition-colors`}>
            <Plus size={20} />
          </a>
        </div>

        {/* Dark Mode Toggle and Logout */}
        <div className="flex flex-col items-center gap-4">
          <button 
            onClick={toggleDarkMode}
            className={`p-3 rounded-full cursor-pointer ${darkMode ? 'bg-gray-600 text-yellow-300' : 'bg-gray-100 text-gray-700'}`}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button onClick={handleLogout} className={`${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-800'} transition-colors bg-white p-3 rounded-full cursor-pointer shadow-2xl hover:shadow-2xl ${darkMode ? 'hover:shadow-red-400' : 'hover:shadow-red-500'}`}>
            <LogOut size={20} />
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex flex-1 gap-5 p-5 overflow-hidden">
        {/* USERS SIDEBAR */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} w-[25vw] rounded-lg shadow-sm overflow-hidden`}>
          <div className="flex flex-col h-full">
            {/* Profile header */}
            <div className="flex items-center p-4 border-b">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10 bg-emerald-500 text-white">
                  <AvatarImage className="object-cover" src="https://i.pinimg.com/736x/aa/32/bc/aa32bc0587d6205c33c224ddd6842b5d.jpg" alt="Profile" />
                  <AvatarFallback>P</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  {/* <span className="font-medium">Welcome, {user.name}</span> */}
                  <span className="font-medium">Welcome, Sonu</span>
                  <span className="text-xs text-green-500">Available</span>
                </div>
              </div>
            </div>

            {/* Chat list */}
            <div className="flex-1 overflow-y-auto hide-scrollbar">
              {chatList.map((chat) => (
                <div 
                  key={chat.id} 
                  onClick={() => handleChatSelect(chat)}
                  className={`flex items-center p-3 cursor-pointer ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                >
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage className="object-cover" src={chat.avatar} alt={chat.name} />
                    <AvatarFallback>{chat.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <span className={`font-medium truncate ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {chat.name}
                      </span>
                      <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {chat.time}
                      </span>
                    </div>
                    <p className={`text-sm truncate ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {chat.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MESSAGES AREA */}
        <div className="flex-1 rounded-lg shadow-sm overflow-hidden flex flex-col relative">
          {/* Background image with dark mode overlay */}
          <div 
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url(${chatBackground})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              filter: darkMode ? 'brightness(0.5)' : 'none',
              opacity: darkMode ? 0.7 : 0.5
            }}
          ></div>

          {selectedChat ? (
            <>
              {/* Message header */}
              <div className={`border-b p-4 flex items-center relative z-10 ${darkMode ? 'border-gray-700 bg-gray-800/90' : 'border-gray-200 bg-white/90'}`}>
                <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                  <img 
                    src={selectedChat.avatar} 
                    alt={selectedChat.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="font-medium">{selectedChat.name}</h2>
                  <p className="text-green-500 text-xs">Online</p>
                </div>
              </div>

              {/* Messages container */}
              <div className="flex-1 p-4 overflow-y-auto hide-scrollbar relative z-10">
                {messages.map((msg, index) => (
                  <div 
                    key={index} 
                    className={`mb-4 ${msg.sender === "You" ? 'text-right' : 'text-left'}`}
                  >
                    {msg.type === "text" ? (
                      <div className={`inline-block p-3 rounded-lg ${msg.sender === "You" 
                        ? (darkMode ? 'bg-indigo-700' : 'bg-indigo-100') 
                        : (darkMode ? 'bg-gray-700' : 'bg-gray-100')}`}
                      >
                        <p>{msg.text}</p>
                        <p className={`text-xs mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                          {msg.time}
                        </p>
                      </div>
                    ) : msg.type === "image" ? (
                      <div className={`inline-block max-w-xs rounded-lg overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <img 
                          src={msg.url || URL.createObjectURL(msg.file)} 
                          alt={msg.text} 
                          className="w-full h-auto"
                        />
                        <div className="p-2">
                          <p className="text-sm">{msg.text}</p>
                          <p className={`text-xs mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                            {msg.time} • {msg.size}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className={`inline-block p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <div className="flex items-center">
                          <FileText className="mr-2" size={20} />
                          <div>
                            <p className="font-medium">{msg.text}</p>
                            <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                              {msg.fileType.toUpperCase()} • {msg.size}
                            </p>
                          </div>
                        </div>
                        <p className={`text-xs mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                          {msg.time}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Message input */}
              <div className={`border-t p-3 relative z-10 ${darkMode ? 'border-gray-700 bg-gray-800/90' : 'border-gray-200 bg-white/90'}`}>
                <div className="flex items-center">
                  <button 
                    className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                    onClick={() => fileInputRef.current.click()}
                  >
                    <Paperclip size={20} />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                    multiple
                  />
                  
                  <button className={`p-2 rounded-full mx-1 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                    <ImageIcon size={20} />
                  </button>
                  
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className={`flex-1 border rounded-full py-2 px-4 mx-1 focus:outline-none focus:ring-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:ring-indigo-500' : 'border-gray-300 focus:ring-indigo-200'}`}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  
                  <button className={`p-2 rounded-full mx-1 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                    <Smile size={20} />
                  </button>
                  
                  {newMessage ? (
                    <button 
                      onClick={handleSendMessage}
                      className={`p-2 rounded-full ${darkMode ? 'bg-[#25d366] hover:bg-[#25d366]' : 'bg-[#25d366] hover:bg-[#25d366]'} text-white`}
                    >
                      <SendHorizonal size={20} />
                    </button>
                  ) : (
                    <button className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                      <Mic size={20} />
                    </button>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className={`flex justify-center items-center h-full relative z-10 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
              <p>Select a conversation to start chatting</p>
            </div>
          )}
        </div>
      </div>
      <Chat />
    </div>
  );
};

export default Dashboard;












// import React, { useState, useRef } from "react";
// import logo from "../assets/logo.png";
// import chatBackground from "../assets/whatsapp-bg.jpg";
// import {
//   CircleDashed,
//   Droplet,
//   House,
//   LogOut,
//   MessageCircle,
//   Plus,
//   Search,
//   Moon,
//   Sun,
//   Paperclip,
//   Image as ImageIcon,
//   FileText,
//   Smile,
//   Mic,
//   SendHorizonal,
// } from "lucide-react";
// import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
// import { useNavigate } from "react-router-dom";
// import useUserStore from "../store/userStore.js";
// import { auth } from "../config/firebase.js";


// const Dashboard = () => {
//   const [darkMode, setDarkMode] = useState(false);
//   const [selectedChat, setSelectedChat] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const fileInputRef = useRef(null);

//   const user = useUserStore((state) => state.user);
//   console.log(user);
//   const navigate = useNavigate();

//   if (!user) {
//     navigate("/");
//     return null;
//   }

//   const toggleDarkMode = () => {
//     setDarkMode(!darkMode);
//   };

//   const chatList = [
//     {
//       id: 1,
//       name: "Aarav Sharma",
//       message: "Hey, are we still meeting tomorrow?",
//       time: "9:15 AM",
//       avatar: "https://i.pinimg.com/736x/84/3e/5b/843e5b0864071ade626c3c93c549909f.jpg",
//       unread: false
//     },
//     {
//       id: 2,
//       name: "Priya Chettri",
//       message: "Please review the documents I sent",
//       time: "10:30 AM",
//       avatar: "https://i.pinimg.com/736x/65/be/98/65be9880275db3afc6079f2075db5efd.jpg",
//       unread: true
//     },
//     {
//       id: 3,
//       name: "Rahul Gupta",
//       message: "Did you get my last message?",
//       time: "11:45 AM",
//       avatar: "https://i.pinimg.com/736x/72/e2/08/72e2081e72d6c2958036726ef03bf98f.jpg",
//       unread: false
//     },
//   ];

//   const handleChatSelect = (chat) => {
//     setSelectedChat(chat);
//     if (chat.name === "Priya Chettri") {
//       setMessages([
//         {
//           sender: chat.name,
//           text: "Please review the documents I sent",
//           time: "10:30 AM",
//           type: "text",
//         },
//         {
//           sender: chat.name,
//           text: "project-specs.pdf",
//           time: "10:31 AM",
//           type: "document",
//           fileType: "pdf",
//           size: "2.4 MB",
//         },
//         {
//           sender: chat.name,
//           text: "design-mockup.jpg",
//           time: "10:32 AM",
//           type: "image",
//           url: "https://i.pinimg.com/736x/b8/f4/4d/b8f44d323752475ead78d666689b54e4.jpg",
//         },
//         {
//           sender: "You",
//           text: "I'll review them and get back to you",
//           time: "10:35 AM",
//           type: "text",
//         },
//         {
//           sender: chat.name,
//           text: "Here's the updated budget sheet",
//           time: "10:36 AM",
//           type: "document",
//           fileType: "xlsx",
//           size: "1.8 MB",
//         },
//       ]);
//     } else {
//       setMessages([
//         { sender: chat.name, text: chat.message, time: chat.time, type: "text" },
//         { sender: "You", text: "Thanks for your message!", time: "Just now", type: "text" },
//       ]);
//     }
//   };

//   const handleSendMessage = () => {
//     if (newMessage.trim()) {
//       setMessages([...messages, {
//         sender: "You",
//         text: newMessage,
//         time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//         type: "text"
//       }]);
//       setNewMessage("");
//     }
//   };

//   const handleFileUpload = (e) => {
//     const files = e.target.files;
//     if (files.length > 0) {
//       const newFiles = Array.from(files).map(file => ({
//         sender: "You",
//         text: file.name,
//         time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//         type: file.type.startsWith("image/") ? "image" : "document",
//         fileType: file.name.split('.').pop(),
//         size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
//         file
//       }));
//       setMessages([...messages, ...newFiles]);
//     }
//   };


//   const setUser = useUserStore((state) => state.setUser);

//   const handleLogout = () => {
//     auth.signOut();
//     setUser(null);
//     navigate("/");
//   };


//   return (
//     // <div className={`h-screen w-screen flex ${darkMode ? 'bg-gray-900 text-white' : 'bg-[#f9f7fd] text-gray-800'} overflow-hidden transition-colors duration-300`}>
//     //   {/* SIDEBAR NAVIGATION */}
//     //   <div className={`flex flex-col items-center justify-between py-10 w-[8vw] ${darkMode ? 'bg-gray-800' : 'bg-[#f9f7fd]'}`}>
//     //     {/* Logo */}
//     //     <div className="w-16 h-16 flex items-center justify-center">
//     //       <img src={logo} alt="logo" className="w-full h-full object-contain" />
//     //     </div>

//     //     {/* Navigation Icons */}
//     //     <div className={`flex flex-col items-center gap-7 w-[70%] rounded-xl py-6 ${darkMode ? 'bg-gray-700' : 'bg-white shadow-lg'}`}>
//     //       <a href="#" className={`${darkMode ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-800 hover:text-indigo-600'} transition-colors`}>
//     //         <House size={20} />
//     //       </a>
//     //       <a href="#" className={`relative ${darkMode ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-800 hover:text-indigo-600'} transition-colors`}>
//     //         <MessageCircle size={20} />
//     //         <span className="absolute top-1 -right-1 block h-2 w-2 bg-green-500 rounded-full ring-2 ring-white"></span>
//     //       </a>
//     //       <a href="#" className={`${darkMode ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-800 hover:text-indigo-600'} transition-colors`}>
//     //         <CircleDashed size={20} />
//     //       </a>
//     //       <a href="#" className={`${darkMode ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-800 hover:text-indigo-600'} transition-colors`}>
//     //         <Droplet size={20} />
//     //       </a>
//     //       <a href="#" className={`${darkMode ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-800 hover:text-indigo-600'} transition-colors`}>
//     //         <Search size={20} />
//     //       </a>
//     //       <a href="#" className={`${darkMode ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-800 hover:text-indigo-600'} transition-colors`}>
//     //         <Plus size={20} />
//     //       </a>
//     //     </div>

//     //     {/* Dark Mode Toggle and Logout */}
//     //     <div className="flex flex-col items-center gap-4">
//     //       <button 
//     //         onClick={toggleDarkMode}
//     //         className={`p-3 rounded-full cursor-pointer ${darkMode ? 'bg-gray-600 text-yellow-300' : 'bg-gray-100 text-gray-700'}`}
//     //       >
//     //         {darkMode ? <Sun size={18} /> : <Moon size={18} />}
//     //       </button>
//     //       <button onClick={handleLogout} className={`${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-800'} transition-colors bg-white p-3 rounded-full cursor-pointer shadow-2xl hover:shadow-2xl ${darkMode ? 'hover:shadow-red-400' : 'hover:shadow-red-500'}`}>
//     //         <LogOut size={20} />
//     //       </button>
//     //     </div>
//     //   </div>

//     //   {/* MAIN CONTENT AREA */}
//     //   <div className="flex flex-1 gap-5 p-5 overflow-hidden">
//     //     {/* USERS SIDEBAR */}
//     //     <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} w-[25vw] rounded-lg shadow-sm overflow-hidden`}>
//     //       <div className="flex flex-col h-full">
//     //         {/* Profile header */}
//     //         <div className="flex items-center p-4 border-b">
//     //           <div className="flex items-center space-x-3">
//     //             <Avatar className="h-10 w-10 bg-emerald-500 text-white">
//     //               <AvatarImage className="object-cover" src="https://i.pinimg.com/736x/aa/32/bc/aa32bc0587d6205c33c224ddd6842b5d.jpg" alt="Profile" />
//     //               <AvatarFallback>P</AvatarFallback>
//     //             </Avatar>
//     //             <div className="flex flex-col">
//     //               {/* <span className="font-medium">Welcome, {user.name}</span> */}
//     //               <span className="font-medium">Welcome Sonu</span>
//     //               <span className="text-xs text-green-500">Available</span>
//     //             </div>
//     //           </div>
//     //         </div>

//     //         {/* Chat list */}
//     //         <div className="flex-1 overflow-y-auto hide-scrollbar">
//     //           {chatList.map((chat) => (
//     //             <div 
//     //               key={chat.id} 
//     //               onClick={() => handleChatSelect(chat)}
//     //               className={`flex items-center p-3 cursor-pointer ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
//     //             >
//     //               <Avatar className="h-10 w-10 mr-3">
//     //                 <AvatarImage className="object-cover" src={chat.avatar} alt={chat.name} />
//     //                 <AvatarFallback>{chat.name.charAt(0)}</AvatarFallback>
//     //               </Avatar>
//     //               <div className="flex-1 min-w-0">
//     //                 <div className="flex justify-between items-center">
//     //                   <span className={`font-medium truncate ${darkMode ? 'text-white' : 'text-gray-800'}`}>
//     //                     {chat.name}
//     //                   </span>
//     //                   <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
//     //                     {chat.time}
//     //                   </span>
//     //                 </div>
//     //                 <p className={`text-sm truncate ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
//     //                   {chat.message}
//     //                 </p>
//     //               </div>
//     //             </div>
//     //           ))}
//     //         </div>
//     //       </div>
//     //     </div>

//     //     {/* MESSAGES AREA */}
//     //     <div className="flex-1 rounded-lg shadow-sm overflow-hidden flex flex-col relative">
//     //       {/* Background image with dark mode overlay */}
//     //       <div 
//     //         className="absolute inset-0 z-0"
//     //         style={{
//     //           backgroundImage: `url(${chatBackground})`,
//     //           backgroundSize: "cover",
//     //           backgroundPosition: "center",
//     //           backgroundRepeat: "no-repeat",
//     //           filter: darkMode ? 'brightness(0.5)' : 'none',
//     //           opacity: darkMode ? 0.7 : 0.5
//     //         }}
//     //       ></div>

//     //       {selectedChat ? (
//     //         <>
//     //           {/* Message header */}
//     //           <div className={`border-b p-4 flex items-center relative z-10 ${darkMode ? 'border-gray-700 bg-gray-800/90' : 'border-gray-200 bg-white/90'}`}>
//     //             <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
//     //               <img 
//     //                 src={selectedChat.avatar} 
//     //                 alt={selectedChat.name} 
//     //                 className="w-full h-full object-cover"
//     //               />
//     //             </div>
//     //             <div>
//     //               <h2 className="font-medium">{selectedChat.name}</h2>
//     //               <p className="text-green-500 text-xs">Online</p>
//     //             </div>
//     //           </div>

//     //           {/* Messages container */}
//     //           <div className="flex-1 p-4 overflow-y-auto hide-scrollbar relative z-10">
//     //             {messages.map((msg, index) => (
//     //               <div 
//     //                 key={index} 
//     //                 className={`mb-4 ${msg.sender === "You" ? 'text-right' : 'text-left'}`}
//     //               >
//     //                 {msg.type === "text" ? (
//     //                   <div className={`inline-block p-3 rounded-lg ${msg.sender === "You" 
//     //                     ? (darkMode ? 'bg-indigo-700' : 'bg-indigo-100') 
//     //                     : (darkMode ? 'bg-gray-700' : 'bg-gray-100')}`}
//     //                   >
//     //                     <p>{msg.text}</p>
//     //                     <p className={`text-xs mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
//     //                       {msg.time}
//     //                     </p>
//     //                   </div>
//     //                 ) : msg.type === "image" ? (
//     //                   <div className={`inline-block max-w-xs rounded-lg overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
//     //                     <img 
//     //                       src={msg.url || URL.createObjectURL(msg.file)} 
//     //                       alt={msg.text} 
//     //                       className="w-full h-auto"
//     //                     />
//     //                     <div className="p-2">
//     //                       <p className="text-sm">{msg.text}</p>
//     //                       <p className={`text-xs mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
//     //                         {msg.time} • {msg.size}
//     //                       </p>
//     //                     </div>
//     //                   </div>
//     //                 ) : (
//     //                   <div className={`inline-block p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
//     //                     <div className="flex items-center">
//     //                       <FileText className="mr-2" size={20} />
//     //                       <div>
//     //                         <p className="font-medium">{msg.text}</p>
//     //                         <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
//     //                           {msg.fileType.toUpperCase()} • {msg.size}
//     //                         </p>
//     //                       </div>
//     //                     </div>
//     //                     <p className={`text-xs mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
//     //                       {msg.time}
//     //                     </p>
//     //                   </div>
//     //                 )}
//     //               </div>
//     //             ))}
//     //           </div>

//     //           {/* Message input */}
//     //           <div className={`border-t p-3 relative z-10 ${darkMode ? 'border-gray-700 bg-gray-800/90' : 'border-gray-200 bg-white/90'}`}>
//     //             <div className="flex items-center">
//     //               <button 
//     //                 className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
//     //                 onClick={() => fileInputRef.current.click()}
//     //               >
//     //                 <Paperclip size={20} />
//     //               </button>
//     //               <input
//     //                 type="file"
//     //                 ref={fileInputRef}
//     //                 onChange={handleFileUpload}
//     //                 className="hidden"
//     //                 multiple
//     //               />
                  
//     //               <button className={`p-2 rounded-full mx-1 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
//     //                 <ImageIcon size={20} />
//     //               </button>
                  
//     //               <input
//     //                 type="text"
//     //                 value={newMessage}
//     //                 onChange={(e) => setNewMessage(e.target.value)}
//     //                 placeholder="Type a message..."
//     //                 className={`flex-1 border rounded-full py-2 px-4 mx-1 focus:outline-none focus:ring-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:ring-indigo-500' : 'border-gray-300 focus:ring-indigo-200'}`}
//     //                 onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
//     //               />
                  
//     //               <button className={`p-2 rounded-full mx-1 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
//     //                 <Smile size={20} />
//     //               </button>
                  
//     //               {newMessage ? (
//     //                 <button 
//     //                   onClick={handleSendMessage}
//     //                   className={`p-2 rounded-full ${darkMode ? 'bg-[#25d366] hover:bg-[#25d366]' : 'bg-[#25d366] hover:bg-[#25d366]'} text-white`}
//     //                 >
//     //                   <SendHorizonal size={20} />
//     //                 </button>
//     //               ) : (
//     //                 <button className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
//     //                   <Mic size={20} />
//     //                 </button>
//     //               )}
//     //             </div>
//     //           </div>
//     //         </>
//     //       ) : (
//     //         <div className={`flex justify-center items-center h-full relative z-10 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
//     //           <p>Select a conversation to start chatting</p>
//     //         </div>
//     //       )}
//     //     </div>
//     //   </div>
//     // </div>

//     <div className="flex-1 rounded-lg shadow-sm overflow-hidden flex flex-col relative">
//     {/* Background image with dark mode overlay */}
//     <div 
//       className="absolute inset-0 z-0"
//       style={{
//         backgroundImage: `url(${chatBackground})`,
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//         backgroundRepeat: "no-repeat",
//         filter: darkMode ? 'brightness(0.5)' : 'none',
//         opacity: darkMode ? 0.7 : 0.5
//       }}
//     ></div>

//     {selectedChat ? (
//       <>
//         {/* Message header */}
//         <div className={`border-b p-4 flex items-center relative z-10 ${darkMode ? 'border-gray-700 bg-gray-800/90' : 'border-gray-200 bg-white/90'}`}>
//           <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
//             <img 
//               src={selectedChat.avatar} 
//               alt={selectedChat.name} 
//               className="w-full h-full object-cover"
//             />
//           </div>
//           <div>
//             <h2 className="font-medium">{selectedChat.name}</h2>
//             <p className="text-green-500 text-xs">Online</p>
//           </div>
//         </div>

//         {/* Messages container */}
//         <div className="flex-1 p-4 overflow-y-auto hide-scrollbar relative z-10">
//           {messages.map((msg, index) => (
//             <div 
//               key={index} 
//               className={`mb-4 ${msg.sender === "You" ? 'text-right' : 'text-left'}`}
//             >
//               {msg.type === "text" ? (
//                 <div className={`inline-block p-3 rounded-lg ${msg.sender === "You" 
//                   ? (darkMode ? 'bg-indigo-700' : 'bg-indigo-100') 
//                   : (darkMode ? 'bg-gray-700' : 'bg-gray-100')}`}
//                 >
//                   <p>{msg.text}</p>
//                   <p className={`text-xs mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
//                     {msg.time}
//                   </p>
//                 </div>
//               ) : msg.type === "image" ? (
//                 <div className={`inline-block max-w-xs rounded-lg overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
//                   <img 
//                     src={msg.url || URL.createObjectURL(msg.file)} 
//                     alt={msg.text} 
//                     className="w-full h-auto"
//                   />
//                   <div className="p-2">
//                     <p className="text-sm">{msg.text}</p>
//                     <p className={`text-xs mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
//                       {msg.time} • {msg.size}
//                     </p>
//                   </div>
//                 </div>
//               ) : (
//                 <div className={`inline-block p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
//                   <div className="flex items-center">
//                     <FileText className="mr-2" size={20} />
//                     <div>
//                       <p className="font-medium">{msg.text}</p>
//                       <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
//                         {msg.fileType.toUpperCase()} • {msg.size}
//                       </p>
//                     </div>
//                   </div>
//                   <p className={`text-xs mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
//                     {msg.time}
//                   </p>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>

//         {/* Message input */}
//         <div className={`border-t p-3 relative z-10 ${darkMode ? 'border-gray-700 bg-gray-800/90' : 'border-gray-200 bg-white/90'}`}>
//           <div className="flex items-center">
//             <button 
//               className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
//               onClick={() => fileInputRef.current.click()}
//             >
//               <Paperclip size={20} />
//             </button>
//             <input
//               type="file"
//               ref={fileInputRef}
//               onChange={handleFileUpload}
//               className="hidden"
//               multiple
//             />
            
//             <button className={`p-2 rounded-full mx-1 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
//               <ImageIcon size={20} />
//             </button>
            
//             <input
//               type="text"
//               value={newMessage}
//               onChange={(e) => setNewMessage(e.target.value)}
//               placeholder="Type a message..."
//               className={`flex-1 border rounded-full py-2 px-4 mx-1 focus:outline-none focus:ring-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:ring-indigo-500' : 'border-gray-300 focus:ring-indigo-200'}`}
//               onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
//             />
            
//             <button className={`p-2 rounded-full mx-1 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
//               <Smile size={20} />
//             </button>
            
//             {newMessage ? (
//               <button 
//                 onClick={handleSendMessage}
//                 className={`p-2 rounded-full ${darkMode ? 'bg-[#25d366] hover:bg-[#25d366]' : 'bg-[#25d366] hover:bg-[#25d366]'} text-white`}
//               >
//                 <SendHorizonal size={20} />
//               </button>
//             ) : (
//               <button className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
//                 <Mic size={20} />
//               </button>
//             )}
//           </div>
//         </div>
//       </>
//     ) : (
//       <div className={`flex justify-center items-center h-full relative z-10 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
//         <p>Select a conversation to start chatting</p>
//       </div>
//     )}
//   </div>
//   );
// };

// export default Dashboard;