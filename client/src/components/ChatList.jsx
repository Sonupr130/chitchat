// import { MoreVertical } from "lucide-react";
// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import useAuthStore from "../store/authStore.js";
// import useChatStore from "../store/chatStore.js";

// const ChatList = ({ isMobile, onSelectChat }) => {

//   const chats = useChatStore((state) => state.chats);
//   console.log('Rendering chats:', chats);
//   const [darkMode, setDarkMode] = useState(false);

//   const toggleDarkMode = () => {
//     setDarkMode(!darkMode);
//   };

//   useEffect(() => {
//     console.log('Chats updated:', chats);
//   }, [chats]);

//   const defaultImage =
//     "https://photosrush.com/wp-content/uploads/no-love-dp-girl-attitude-for-instagram.jpg";

//   const user = useAuthStore((state) => state.user);
//   console.log(user);
//   const navigate = useNavigate();

//   if (!user) {
//     navigate("/");
//     return null;
//   }

//   const userPhoto = user.photoCloudinary || user.photo || defaultImage;
//   const firstName = user.name ? user.name.split(' ')[0] : 'User';

//   return (
//     <div
//       className={`${
//         darkMode ? "bg-gray-800" : "bg-white"
//       } w-[25vw] overflow-hidden`}
//     >
//       <div className="flex items-center justify-between p-4 border-b border-gray-200">
//         <div className="flex items-center gap-3">
//           {/* Avatar */}
//           <div className="relative h-10 w-10 rounded-full overflow-hidden">
//             <img
//               src={userPhoto}
//               alt="logo"
//               className="h-full w-full object-cover"
//             />
//           </div>

//           {/* User info */}
//           <div className="flex flex-col">
//             <span className="font-medium text-gray-900">Hey!! {firstName}</span>
//             <div className="flex items-center gap-1">
//               <span className="text-xs text-green-600">Available</span>
//             </div>
//           </div>
//         </div>

//         {/* Vertical icon aligned to the right */}
//         <button className="text-gray-500 hover:text-gray-700 transition-colors">
//           <MoreVertical size={20} />
//         </button>
//       </div>

//       {/* CHATS LIST  */}
//       <div>
//         {chats.map((chat) => (
//           <Link
//             to={`/chat/${chat.id}`}
//             key={chat.id}
//             className="block px-4 py-3 border-b hover:bg-gray-50 cursor-pointer"
//             onClick={() => isMobile && onSelectChat(chat)}
//           >
//             <div className="flex items-start">
//               <div className="relative flex-shrink-0">
//                 <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden flex items-center justify-center">
//                   <img
//                     src={chat.image || defaultImage}
//                     alt={chat.name}
//                     className="object-cover h-full w-full"
//                   />
//                 </div>
//                 {chat.status === "Available" && (
//                   <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
//                 )}
//               </div>
//               <div className="ml-3 flex-1 overflow-hidden">
//                 <div className="flex justify-between items-baseline">
//                   <h3 className="text-sm font-medium">{chat.name}</h3>
//                   {chat.time && (
//                     <span className="text-xs text-gray-500">{chat.time}</span>
//                   )}
//                 </div>
//                 <p className="text-xs text-gray-500 truncate">
//                   {chat.lastMessage}
//                 </p>
//               </div>
//             </div>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ChatList;








// import { MoreVertical } from "lucide-react";
// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import useAuthStore from "../store/authStore.js";
// import useChatStore from "../store/chatStore.js";
// import axios from "axios";

// const ChatList = ({ isMobile, onSelectChat }) => {
//   const [darkMode, setDarkMode] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { chats, setChats } = useChatStore();
//   const user = useAuthStore((state) => state.user);
//   const navigate = useNavigate();

//   const defaultImage = "https://photosrush.com/wp-content/uploads/no-love-dp-girl-attitude-for-instagram.jpg";

//   const toggleDarkMode = () => {
//     setDarkMode(!darkMode);
//   };

//   useEffect(() => {
//     const fetchChats = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) throw new Error("No authentication token found");

//         const response = await axios.get("http://localhost:8000/api/chat/list", {
//           headers: { Authorization: `Bearer ${token}` }
//         });
        
//         console.log("data of chats", response)

//         if (response.data.success) {
//           // Transform the API response to match your frontend structure
//           const formattedChats = response.data.chats.map(chat => ({
//             id: chat._id,
//             _id: chat._id,
//             name: chat.receiver?.name || "Unknown User",
//             status: "Available",
//             lastMessage: chat.message,
//             time: new Date(chat.timestamp).toLocaleTimeString([], {
//               hour: "2-digit",
//               minute: "2-digit"
//             }),
//             image: chat.receiver?.photo || defaultImage,
//             messages: [{
//               _id: chat._id,
//               senderId: chat.senderId,
//               message: chat.message,
//               timestamp: chat.timestamp
//             }]
//           }));

//           setChats(formattedChats);
//         } else {
//           throw new Error(response.data.message || "Failed to fetch chats");
//         }
//       } catch (err) {
//         console.error("Fetch chats error:", err);
//         setError(err.response?.data?.message || err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (user) {
//       fetchChats();
//     }
//   }, [user, setChats]);

//   useEffect(() => {
//     console.log('Chats updated:', chats);
//   }, [chats]);

//   if (!user) {
//     navigate("/");
//     return null;
//   }

//   const userPhoto = user.photoCloudinary || user.photo || defaultImage;
//   const firstName = user.name ? user.name.split(' ')[0] : 'User';

//   if (loading) {
//     return (
//       <div className={`${darkMode ? "bg-gray-800" : "bg-white"} w-[25vw] p-4`}>
//         <p>Loading chats...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className={`${darkMode ? "bg-gray-800" : "bg-white"} w-[25vw] p-4`}>
//         <p className="text-red-500">Error: {error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className={`${darkMode ? "bg-gray-800" : "bg-white"} w-[25vw] overflow-hidden`}>
//       {/* Header remains the same */}      
//       <div className="flex items-center justify-between p-4 border-b border-gray-200">
//         {/* ... existing header code ... */}

//         <div className="flex items-center gap-3">
//                      {/* Avatar */}
//           <div className="relative h-10 w-10 rounded-full overflow-hidden">
//              <img
//                src={userPhoto}
//                alt="logo"
//                className="h-full w-full object-cover"
//              />
//            </div>
//            <div className="flex flex-col">
//              <span className="font-medium text-gray-900">Hey!! {firstName}</span>
//              <div className="flex items-center gap-1">
//                <span className="text-xs text-green-600">Available</span>
//              </div>
//            </div>
//          </div>
//          <button className="text-gray-500 hover:text-gray-700 transition-colors">
//            <MoreVertical size={20} />
//          </button>
//       </div>

//       {/* CHATS LIST */}
//       <div>
//         {chats.length > 0 ? (
//           chats.map((chat) => (
//             <Link
//               to={`/chat/${chat.id}`}
//               key={chat.id}
//               className="block px-4 py-3 border-b hover:bg-gray-50 cursor-pointer"
//               onClick={() => isMobile && onSelectChat(chat)}
//             >
//               {/* ... existing chat item code ... */}
//               <div className="flex items-start">
//                <div className="relative flex-shrink-0">
//                  <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden flex items-center justify-center">
//                    <img
//                      src={chat.image || defaultImage}
//                      alt={chat.name}
//                      className="object-cover h-full w-full"
//                    />
//                  </div>
//                  {chat.status === "Available" && (
//                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
//                  )}
//                </div>
//                <div className="ml-3 flex-1 overflow-hidden">
//                  <div className="flex justify-between items-baseline">
//                    <h3 className="text-sm font-medium">{chat.name}</h3>
//                    {chat.time && (
//                      <span className="text-xs text-gray-500">{chat.time}</span>
//                    )}
//                  </div>
//                  <p className="text-xs text-gray-500 truncate">
//                    {chat.lastMessage}
//                  </p>
//                </div>
//              </div>
//             </Link>
//           ))
//         ) : (
//           <div className="p-4 text-center text-gray-500">
//             No chats found. Start a new conversation!
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChatList;




import { MoreVertical } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore.js";
import useChatStore from "../store/chatStore.js";
import axios from "axios";

const ChatList = ({ isMobile, onSelectChat }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { chats, setChats } = useChatStore();
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const defaultImage = "https://photosrush.com/wp-content/uploads/no-love-dp-girl-attitude-for-instagram.jpg";

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No authentication token found");

        const response = await axios.get("http://localhost:8000/api/chat/list", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data.success) {
          // Transform the API response to match your frontend structure
          const formattedChats = response.data.chats.map(chat => {
            // Determine if current user is the sender
            const isSender = user._id === chat.senderId._id;
            
            // Get the other user's info (receiver if current user is sender, sender if current user is receiver)
            const otherUser = isSender ? chat.receiverId : chat.senderId;
            
            return {
              id: chat._id,
              _id: chat._id,
              name: otherUser?.name || "Unknown User",
              status: "Available",
              lastMessage: chat.message,
              time: new Date(chat.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
              }),
              image: otherUser?.photo || defaultImage,
              messages: [{
                _id: chat._id,
                senderId: chat.senderId,
                message: chat.message,
                timestamp: chat.timestamp
              }]
            };
          });

          setChats(formattedChats);
        } else {
          throw new Error(response.data.message || "Failed to fetch chats");
        }
      } catch (err) {
        console.error("Fetch chats error:", err);
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchChats();
    }
  }, [user, setChats]);

  useEffect(() => {
    console.log('Chats updated:', chats);
  }, [chats]);

  if (!user) {
    navigate("/");
    return null;
  }

  const userPhoto = user.photoCloudinary || user.photo || defaultImage;
  const firstName = user.name ? user.name.split(' ')[0] : 'User';

  if (loading) {
    return (
      <div className={`${darkMode ? "bg-gray-800" : "bg-white"} w-[25vw] p-4`}>
        <p>Loading chats...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${darkMode ? "bg-gray-800" : "bg-white"}  w-full sm:w-[25vw]`}>
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className={`h-full overflow-y-auto ${darkMode ? "bg-gray-800 text-white" : "bg-white rounded-md text-gray-800"} w-full sm:w-[30vw] md:w-[25vw] ` }>
      {/* Header */}
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
          <div className="flex flex-col">
            <span className="font-medium">Hey!! {firstName}</span>
            <div className="flex items-center gap-1">
              <span className="text-xs text-green-600">Available</span>
            </div>
          </div>
        </div>
        <button className="hover:text-gray-700 transition-colors">
          <MoreVertical size={20} />
        </button>
      </div>

      {/* CHATS LIST */}
      <div>
        {chats.length > 0 ? (
          chats.map((chat) => (
            <Link
              to={`/chat/${chat.id}`}
              key={chat.id}
              className={`block px-4 py-3 border-b hover:bg-gray-50 cursor-pointer ${
                darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
              }`}
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
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">
            No chats found. Start a new conversation!
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;
























