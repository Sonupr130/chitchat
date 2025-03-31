import { Outlet, useNavigate } from 'react-router-dom';
import ChatList from '../components/ChatList.jsx';
import { useState } from 'react';

const ChatsPage = ({ isMobile }) => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  
     const toggleDarkMode = () => {
      setDarkMode(!darkMode);
    };

  const handleSelectChat = (chatId) => {
    navigate(`/chat/${chatId}`);
    if (isMobile) {
    }
  };

  return (
    <div className="flex flex-1 gap-5 h-full overflow-hidden">
      {(!isMobile || !selectedChat) && (
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} w-[25vw] rounded-lg shadow-sm overflow-hidden`}>
          <ChatList onSelectChat={handleSelectChat} />
        </div>
      )}
      <div className={`${isMobile && selectedChat ? 'w-full' : 'hidden md:flex flex-1'} `}>
        <Outlet />
      </div>
    </div>
  );
};

export default ChatsPage;