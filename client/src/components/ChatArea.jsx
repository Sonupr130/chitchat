// import { useChatStore } from "../store/chatStore.js";
import {
  MoreVertical,
  Paperclip,
  Phone,
  Send,
  Smile,
  Video,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ChatArea = ({ isMobile, userId, receiverId, groupId }) => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  // const { messages, sendMessage, receiveMessage, isTyping, sendTyping, receiveTyping } = useChatStore();
  const [message, setMessage] = useState("");

  const defaultImage =
    "https://photosrush.com/wp-content/uploads/no-love-dp-girl-attitude-for-instagram.jpg";

  // Dummy chats data
  const chats = [
    {
      id: "1",
      name: "Sonu Pradhan",
      status: "Available",
      lastMessage: "Welcome, Sonu Pradhan",
    },
    {
      id: "2",
      name: "Aarav Sharma",
      status: "",
      lastMessage: "Hey, are we still meeting tomorrow?",
    },
    {
      id: "3",
      name: "Priya Chettri",
      status: "",
      lastMessage: "Please review the documents I sent",
    },
    {
      id: "4",
      name: "Rahul Gupta",
      status: "Online",
      lastMessage: "Did you get my last message?",
    },
  ];

  // Find the current chat or use a default if not found
  const currentChat = chats.find((chat) => chat.id === chatId) || {
    name: "Unknown",
    status: "",
    lastMessage: "Select a chat to start messaging",
  };

  const handleBack = () => {
    navigate("/chat");
  };

  // // Sample messages data
  const messages = [
    {
      id: 1,
      sender: currentChat.name,
      text: currentChat.lastMessage,
      time: "11:45 AM",
      isMe: false,
    },
    {
      id: 2,
      sender: "Me",
      text: "Thanks for your message!",
      time: "Just now",
      isMe: true,
    },
  ];

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    // Handle file upload logic
  };

  // useEffect(() => {
  //   receiveTyping();
  // }, []);

  // const handleTyping = () => {
  //   sendTyping(userId, receiverId, groupId);
  // };

  // useEffect(() => {
  //   receiveMessage();
  //   axios
  //     .get(
  //       `http://localhost:8000/api/chat/get-messages?senderId=${userId}&receiverId=${receiverId}`
  //     )
  //     .then((res) => useChatStore.setState({ messages: res.data }));
  // }, [userId, receiverId, receiveMessage]);

  const handleSend = () => {
    // sendMessage(userId, receiverId, message);
    // setMessage("");
  };

  return (
    // <div className="flex flex-col h-full bg-amber-200">
    <div className="flex-1 rounded-lg shadow-sm overflow-hidden flex flex-col relative bg-gray-100">
      {isMobile && (
        <div className="bg-white p-4 border-b border-gray-200 flex items-center">
          <button onClick={handleBack} className="mr-2 text-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <div>
            <h3 className="font-medium text-gray-900">{currentChat.name}</h3>
            {currentChat.status && (
              <p className="text-xs text-gray-500">
                <span className="w-2 h-2 mr-1 bg-green-500 rounded-full inline-block"></span>
                {currentChat.status}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="bg-white p-4 border-b flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden flex items-center justify-center">
            <img
              src={defaultImage || "❤️"}
              alt="user_image"
              className="object-cover"
            />
          </div>
          <div className="ml-3">
            <h2 className="text-sm font-medium">{currentChat.name}</h2>
            <p className="text-xs text-green-500">Online</p>
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

      <div className="flex-1 overflow-y-auto p-4">
        <div className="text-center mb-6">
          <span className="text-xs bg-gray-200 rounded-full px-3 py-1 text-gray-500">
            Today
          </span>
        </div>

        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 ${message.isMe ? "text-right" : "text-left"}`}
          >
            {/* {!message.isMe && <p className="text-sm font-medium text-gray-700">{message.sender}</p>} */}
            <div
              className={`inline-block p-3 rounded-lg ${
                message.isMe
                  ? "bg-blue-500 text-white"
                  : "bg-white border border-gray-200"
              }`}
            >
              <p>{message.text}</p>
              <p
                className={`text-xs mt-1 ${
                  message.isMe ? "text-blue-100" : "text-gray-500"
                }`}
              >
                {message.time}
              </p>
            </div>
          </div>
        ))}
      </div>


        {/* SAMPLE CHAT CONTAINER  */}
      {/* <div className="chat-container">
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.senderId === userId ? "sent" : "received"}`}>
            {msg.message}
          </div>
        ))}
        {isTyping && <p className="typing-indicator">Typing...</p>}
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            handleTyping();
          }}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div> */}

      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center w-full relative">
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              handleTyping();
            }}
            className="flex-1 border border-gray-300 rounded-full py-2 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="absolute right-14 top-1/2 transform -translate-y-1/2 flex gap-2 text-gray-500">
            <Smile className="w-5 h-5 cursor-pointer hover:text-blue-500" />
            <Paperclip
              onClick={handleFileUpload}
              className="w-5 h-5 cursor-pointer hover:text-blue-500"
            />
          </div>
          <button className="ml-2 p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 focus:outline-none">
            <Send onClick={handleSend} className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
