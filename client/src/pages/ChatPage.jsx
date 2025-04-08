
// import { Outlet, useNavigate, useParams } from 'react-router-dom';
// import ChatList from '../components/ChatList.jsx';
// import { useState } from 'react';

// const ChatsPage = ({ isMobile }) => {
//   const navigate = useNavigate();
//   const { chatId } = useParams(); // detect if a chat is selected
//   const [darkMode, setDarkMode] = useState(false);

//   const toggleDarkMode = () => {
//     setDarkMode(!darkMode);
//   };

//   const handleSelectChat = (chatId) => {
//     navigate(`/chat/${chatId}`);
//   };

//   return (
//     <div className="flex flex-col md:flex-row h-full w-full overflow-hidden">
//       {/* Chat List */}
//       {(!isMobile || !chatId) && (
//         <div className={`md:w-1/4 w-full h-full ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm  `}>
//           <ChatList onSelectChat={handleSelectChat} />
//         </div>
//       )}

//       {/* Chat View */}
//       {(!isMobile || chatId) && (
//         <div className="flex-1 h-full overflow-y-auto ml-10 mr-8">
//           <Outlet />
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChatsPage;



import { Outlet, useNavigate, useParams } from 'react-router-dom';
import ChatList from '../components/ChatList.jsx';
import { useState } from 'react';

const ChatsPage = ({ isMobile }) => {
  const navigate = useNavigate();
  const { chatId } = useParams(); // detect if a chat is selected
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleSelectChat = (chatId) => {
    navigate(`/chat/${chatId}`);
  };

  return (
    <div className="flex flex-col md:flex-row h-full w-full overflow-hidden">
      {/* Chat List */}
      {(!isMobile || !chatId) && (
        <div className={`md:w-1/4 w-full h-full ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm`}>
          <ChatList onSelectChat={handleSelectChat} />
        </div>
      )}

      {/* Chat View */}
      {(!isMobile || chatId) && (
        <div className="flex-1 h-full overflow-y-auto ml-10 mr-8">
          <Outlet />
        </div>
      )}
    </div>
  );
};

export default ChatsPage;


