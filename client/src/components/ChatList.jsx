import { MoreVertical } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore.js";
import useChatStore from "../store/chatStore.js";

const ChatList = ({ isMobile, onSelectChat }) => {

  const chats = useChatStore((state) => state.chats);
  console.log('Rendering chats:', chats);
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    console.log('Chats updated:', chats);
  }, [chats]);

  const defaultImage =
    "https://photosrush.com/wp-content/uploads/no-love-dp-girl-attitude-for-instagram.jpg";

  const user = useAuthStore((state) => state.user);
  console.log(user);
  const navigate = useNavigate();

  if (!user) {
    navigate("/");
    return null;
  }

  const userPhoto = user.photoCloudinary || user.photo || defaultImage;
  const firstName = user.name ? user.name.split(' ')[0] : 'User';

  return (
    <div
      className={`${
        darkMode ? "bg-gray-800" : "bg-white"
      } w-[25vw] overflow-hidden`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="relative h-10 w-10 rounded-full overflow-hidden">
            <img
              src={userPhoto}
              alt="logo"
              className="h-full w-full object-cover"
            />
          </div>

          {/* User info */}
          <div className="flex flex-col">
            <span className="font-medium text-gray-900">Hey!! {firstName}</span>
            <div className="flex items-center gap-1">
              <span className="text-xs text-green-600">Available</span>
            </div>
          </div>
        </div>

        {/* Vertical icon aligned to the right */}
        <button className="text-gray-500 hover:text-gray-700 transition-colors">
          <MoreVertical size={20} />
        </button>
      </div>

      {/* CHATS LIST  */}
      <div>
        {chats.map((chat) => (
          <Link
            to={`/chat/${chat.id}`}
            key={chat.id}
            className="block px-4 py-3 border-b hover:bg-gray-50 cursor-pointer"
            onClick={() => isMobile && onSelectChat(chat)}
          >
            <div className="flex items-start">
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden flex items-center justify-center">
                  <img
                    src={chat.image || defaultImage}
                    alt={chat.name}
                    className="object-cover h-full w-full"
                  />
                </div>
                {chat.status === "Available" && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className="ml-3 flex-1 overflow-hidden">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-sm font-medium">{chat.name}</h3>
                  {chat.time && (
                    <span className="text-xs text-gray-500">{chat.time}</span>
                  )}
                </div>
                <p className="text-xs text-gray-500 truncate">
                  {chat.lastMessage}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ChatList;
















