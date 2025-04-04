// import React, { useState } from "react";
// import { Check, Search, UserPlus, X } from "lucide-react";

// const Online = () => {
//   const [darkMode, setDarkMode] = useState(false);

//   const toggleDarkMode = () => {
//     setDarkMode(!darkMode);
//   };

//   const friendRequests = [
//     { id: 1, name: "Akshay Kumar", mutualFriends: 3 },
//     { id: 2, name: "Divya Sharma", mutualFriends: 5 },
//   ];

//   const friends = [
//     { id: 1, name: "Aarav Sharma", status: "Online" },
//     { id: 2, name: "Priya Chettri", status: "Away" },
//     { id: 3, name: "Rahul Gupta", status: "Offline" },
//     { id: 4, name: "Neha Singh", status: "Online" },
//     { id: 5, name: "Vikram Patel", status: "Online" },
//   ];

//   const suggestedFriends = [
//     { id: 1, name: "Anjali Patel", mutualFriends: 8 },
//     { id: 2, name: "Rajesh Khanna", mutualFriends: 2 },
//     { id: 3, name: "Meera Singh", mutualFriends: 4 },
//     { id: 4, name: "Vivek Malhotra", mutualFriends: 7 },
//   ];

//   const defaultImage =
//     "https://i.pinimg.com/736x/e4/04/13/e40413c5fd5cf7dc4f41aa6d911ce764.jpg";

//   return (
//     <div
//       className={`${
//         darkMode ? "bg-gray-800" : "bg-white"
//       } w-[25vw] rounded-lg shadow-sm overflow-hidden`}
//     >
//       <div className="flex flex-col h-full">
//         <div className="p-4 border-b">
//           <h1 className="text-lg font-semibold">Stalk who`s Online</h1>
//         </div>

//         {/* Search bar */}
//         <div className="p-3">
//           <div className="relative">
//             <input
//               type="text"
//               className="w-full pl-8 pr-3 py-2 bg-gray-100 rounded-full text-sm focus:outline-none"
//               placeholder="Search"
//             />
//             <Search
//               size={16}
//               className="absolute left-3 top-2.5 text-gray-500"
//             />
//           </div>
//         </div>

//         <div className="overflow-y-auto h-full pb-20">
//           <div className="hide-scrollbar">
//             <div className="px-4 py-2 bg-gray-50">
//               <h3 className="text-xs font-medium text-gray-500">
//                 ONLINE FRIENDS
//               </h3>
//             </div>
//             {friends.map((friend) => (
//               <div
//                 key={friend.id}
//                 className="px-4 py-3 border-b hover:bg-gray-50 cursor-pointer"
//               >
//                 <div className="flex items-center">
//                   <div className="relative flex-shrink-0">
//                     <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden flex items-center justify-center">
//                       <img
//                         src={defaultImage || '/default-profile.png'}
//                         alt={friend.name}
//                         className="object-cover"
//                       />
//                     </div>
//                     <div
//                       className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
//                         friend.status === "Online"
//                           ? "bg-green-500"
//                           : friend.status === "Away"
//                           ? "bg-yellow-500"
//                           : "bg-gray-500"
//                       }`}
//                     ></div>
//                   </div>
//                   <div className="ml-3">
//                     <h3 className="text-sm font-medium">{friend.name}</h3>
//                     <p className="text-xs text-gray-500">{friend.status}</p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Online;










// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Check, Search, UserPlus, X } from "lucide-react";
// import useAuthStore from "../store/authStore.js";
// import useChatStore from "../store/chatStore.js";
// import { useNavigate } from "react-router-dom";

// const Online = () => {
//   const [darkMode, setDarkMode] = useState(false);
//   const [friends, setFriends] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { user } = useAuthStore();
//   const navigate = useNavigate();
//   const toggleDarkMode = () => {
//     setDarkMode(!darkMode);
//   };

//   const { addChat } = useChatStore();


//   const handleFriendClick = async (friend) => {
//     try {
//       const token = localStorage.getItem("token");

//       // First add to backend
//       const response = await axios.post(
//         "http://localhost:8000/api/user/chats",
//         {
//           friendId: friend._id,
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       console.log("Backend response:", response.data);

//       if (response.data.success) {
//         // Then add to local state
//         addChat({
//           id: friend._id, // Changed from _id to id to match your store
//           name: friend.name,
//           status: friend.status || "Online",
//           lastMessage: `Started chatting with ${friend.name}`,
//           time: new Date().toLocaleTimeString([], {
//             hour: "2-digit",
//             minute: "2-digit",
//           }),
//           unread: false,
//           image: friend.photo,
//         });

//         // Optionally navigate to the chat
//         navigate(`/chat/${friend._id}`);
//       }
//     } catch (error) {
//       console.error(
//         "Error creating chat:",
//         error.response?.data || error.message
//       );
//       // Show error to user
//       setError("Failed to start chat. Please try again.");
//     }
//   };
//   console.log("Current chats:", useChatStore.getState().chats);

//   const defaultImage =
//     "https://i.pinimg.com/736x/e4/04/13/e40413c5fd5cf7dc4f41aa6d911ce764.jpg";

//   useEffect(() => {
//     const fetchFriends = async () => {
//       try {
//         const token = localStorage.getItem("token");

//         if (!token) {
//           throw new Error("No authentication token found");
//         }

//         // First ensure we have user data
//         if (!user) {
//           const verifyResponse = await axios.get(
//             "http://localhost:8000/api/auth/verify",
//             { headers: { Authorization: `Bearer ${token}` } }
//           );
//           if (!verifyResponse.data.user) {
//             throw new Error("User verification failed");
//           }
//         }

//         const response = await axios.get(
//           "http://localhost:8000/api/user/friends",
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         if (response.data.success) {
//           setFriends(
//             response.data.friends.map((friend) => ({
//               ...friend,
//               photo: friend.photo || defaultImage, // Ensure photo has a fallback
//             }))
//           );
//         } else {
//           throw new Error(response.data.message || "Failed to fetch friends");
//         }
//       } catch (err) {
//         console.error("Fetch friends error:", err);
//         setError(err.response?.data?.message || err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFriends();
//   }, [user]);

//   return (
//     <div
//       className={`${
//         darkMode ? "bg-gray-800" : "bg-white"
//       } w-[25vw] rounded-lg shadow-sm overflow-hidden`}
//     >
//       <div className="flex flex-col h-full">
//         <div className="p-4 border-b">
//           <h1 className="text-lg font-semibold">Stalk who`s Online</h1>
//         </div>

//         {/* Search bar */}
//         <div className="p-3">
//           <div className="relative">
//             <input
//               type="text"
//               className="w-full pl-8 pr-3 py-2 bg-gray-100 rounded-full text-sm focus:outline-none"
//               placeholder="Search"
//             />
//             <Search
//               size={16}
//               className="absolute left-3 top-2.5 text-gray-500"
//             />
//           </div>
//         </div>

//         <div className="overflow-y-auto h-full pb-20">
//           <div className="hide-scrollbar">
//             <div className="px-4 py-2 bg-gray-50">
//               <h3 className="text-xs font-medium text-gray-500">
//                 ONLINE FRIENDS
//               </h3>
//             </div>

//             {loading && <p className="text-center py-4">Loading friends...</p>}
//             {error && <p className="text-center py-4 text-red-500">{error}</p>}

//             {!loading && !error && friends.length === 0 && (
//               <p className="text-center py-4 text-gray-500">
//                 No friends available.
//               </p>
//             )}

//             {friends.map((friend) => (
//               <div
//                 key={friend._id}
//                 className="px-4 py-3 border-b hover:bg-gray-50 cursor-pointer"
//                 onClick={() => handleFriendClick(friend)}
//               >
//                 <div className="flex items-center">
//                   <div className="relative flex-shrink-0">
//                     <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden flex items-center justify-center">
//                       <img
//                         src={friend.photo || defaultImage}
//                         alt={friend.name}
//                         className="object-cover w-full h-full"
//                       />
//                     </div>
//                     <div
//                       className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
//                         friend.status === "Online"
//                           ? "bg-green-500"
//                           : friend.status === "Away"
//                           ? "bg-yellow-500"
//                           : "bg-gray-500"
//                       }`}
//                     ></div>
//                   </div>
//                   <div className="ml-3">
//                     <h3 className="text-sm font-medium">{friend.name}</h3>
//                     <p className="text-xs text-gray-500">{friend.status}</p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Online;



import React, { useEffect, useState } from "react";
import axios from "axios";
import { Search } from "lucide-react";
import useAuthStore from "../store/authStore.js";
import useChatStore from "../store/chatStore.js";
import { useNavigate } from "react-router-dom";

const Online = () => {
  // State Management
  const [darkMode, setDarkMode] = useState(false);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthStore();
  const navigate = useNavigate();
  
  const { addChat } = useChatStore();
  const defaultImage = "https://i.pinimg.com/736x/e4/04/13/e40413c5fd5cf7dc4f41aa6d911ce764.jpg";

  // Fetch Friends List
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No authentication token found");

        // Verify User (if not already in state)
        if (!user) {
          const verifyResponse = await axios.get(
            "http://localhost:8000/api/auth/verify",
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (!verifyResponse.data.user) {
            throw new Error("User verification failed");
          }
        }

        // Fetch Friends
        const response = await axios.get(
          "http://localhost:8000/api/user/friends",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.success) {
          setFriends(
            response.data.friends.map((friend) => ({
              ...friend,
              photo: friend.photo || defaultImage,
            }))
          );
        } else {
          throw new Error(response.data.message || "Failed to fetch friends");
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, [user]);

  // Handle Click on a Friend to Start Chat
  // const handleFriendClick = async (friend) => {
  //   try {
  //     // Check if chat already exists
  //     const existingChat = useChatStore.getState().chats.find(
  //       (chat) => chat.id === friend._id
  //     );
      
  //     if (existingChat) {
  //       navigate(`/chat/${friend._id}`);
  //       return;
  //     }
  
  //     // Create chat directly in Zustand store
  //     addChat({
  //       id: friend._id,
  //       _id: friend._id, // Include both for consistency
  //       name: friend.name,
  //       status: friend.status === "offline" ? "Offline" : "Online",
  //       lastMessage: `Started chatting with ${friend.name}`,
  //       time: new Date().toLocaleTimeString([], {
  //         hour: "2-digit",
  //         minute: "2-digit",
  //       }),
  //       unread: false,
  //       image: friend.photo || defaultImage,
  //       messages: [] // Initialize empty messages array
  //     });
  
  //     // Navigate to the new chat
  //     navigate(`/chat/${friend._id}`);
      
  //   } catch (error) {
  //     console.error("Error creating chat:", error);
  //     setError("Failed to create chat locally");
  //   }
  // };



  const handleFriendClick = async (friend) => {
    try {
      const token = localStorage.getItem("token");
      
      // Check if chat exists locally first
      const existingChat = useChatStore.getState().chats.find(
        (chat) => chat.id === friend._id
      );
      
      if (existingChat) {
        navigate(`/chat/${friend._id}`);
        return;
      }
  
      // Create chat in backend
      const response = await axios.post(
        "http://localhost:8000/api/chat/chatadd",
        {
          receiverId: friend._id,
          message: `Started chatting with ${friend.name}`
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
  
      if (response.data.success) {
        // Add to Zustand store
        addChat({
          id: friend._id,
          _id: response.data.chat._id, // Use the ID from the database
          name: friend.name,
          status: friend.status === "offline" ? "Offline" : "Online",
          lastMessage: `Started chatting with ${friend.name}`,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          unread: false,
          image: friend.photo || defaultImage,
          messages: [{
            _id: response.data.chat._id,
            senderId: user._id,
            receiverId: friend._id,
            message: `Started chatting with ${friend.name}`,
            timestamp: new Date().toISOString()
          }]
        });
  
        navigate(`/chat/${friend._id}`);
      } else {
        throw new Error(response.data.message || "Failed to create chat");
      }
    } catch (error) {
      console.error("Error creating chat:", error);
      setError("Failed to start chat. Please try again.");
    }
  };

  // UI Rendering
  
  // Online.js

  return (
    <div
      className={`${
        darkMode ? "bg-gray-800" : "bg-white"
      } w-[25vw] rounded-lg shadow-sm overflow-hidden`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b">
          <h1 className="text-lg font-semibold">Stalk who's Online</h1>
        </div>

        {/* Search Bar */}
        <div className="p-3">
          <div className="relative">
            <input
              type="text"
              className="w-full pl-8 pr-3 py-2 bg-gray-100 rounded-full text-sm focus:outline-none"
              placeholder="Search"
            />
            <Search size={16} className="absolute left-3 top-2.5 text-gray-500" />
          </div>
        </div>

        {/* Friends List */}
        <div className="overflow-y-auto h-full pb-20">
          <div className="hide-scrollbar">
            <div className="px-4 py-2 bg-gray-50">
              <h3 className="text-xs font-medium text-gray-500">ONLINE FRIENDS</h3>
            </div>

            {/* Loading & Error States */}
            {loading && <p className="text-center py-4">Loading friends...</p>}
            {error && <p className="text-center py-4 text-red-500">{error}</p>}
            {!loading && !error && friends.length === 0 && (
              <p className="text-center py-4 text-gray-500">No friends available.</p>
            )}

            {/* Friends List Mapping */}
            {friends.map((friend) => (
              <div
                key={friend._id}
                className="px-4 py-3 border-b hover:bg-gray-50 cursor-pointer"
                onClick={() => handleFriendClick(friend)}
              >
                <div className="flex items-center">
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden flex items-center justify-center">
                      <img
                        src={friend.photo || defaultImage}
                        alt={friend.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                        friend.status === "Online"
                          ? "bg-green-500"
                          : friend.status === "Away"
                          ? "bg-yellow-500"
                          : "bg-gray-500"
                      }`}
                    ></div>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium">{friend.name}</h3>
                    <p className="text-xs text-gray-500">{friend.status}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Online;