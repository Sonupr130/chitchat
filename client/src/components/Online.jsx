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









import React, { useEffect, useState } from "react";
import axios from "axios";
import { Check, Search, UserPlus, X } from "lucide-react";
import useAuthStore from "../store/authStore.js";

const Online = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthStore();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const defaultImage =
    "https://i.pinimg.com/736x/e4/04/13/e40413c5fd5cf7dc4f41aa6d911ce764.jpg";



  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const token = localStorage.getItem("token");
        
        if (!token) {
          throw new Error("No authentication token found");
        }

        // First ensure we have user data
        if (!user) {
          const verifyResponse = await axios.get(
            "http://localhost:8000/api/auth/verify",
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (!verifyResponse.data.user) {
            throw new Error("User verification failed");
          }
        }

        const response = await axios.get(
          "http://localhost:8000/api/user/friends",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.success) {
          setFriends(response.data.friends.map(friend => ({
            ...friend,
            photo: friend.photo || defaultImage // Ensure photo has a fallback
          })));
        } else {
          throw new Error(response.data.message || "Failed to fetch friends");
        }
      } catch (err) {
        console.error("Fetch friends error:", err);
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, [user]);

  return (
    <div
      className={`${
        darkMode ? "bg-gray-800" : "bg-white"
      } w-[25vw] rounded-lg shadow-sm overflow-hidden`}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 border-b">
          <h1 className="text-lg font-semibold">Stalk who`s Online</h1>
        </div>

        {/* Search bar */}
        <div className="p-3">
          <div className="relative">
            <input
              type="text"
              className="w-full pl-8 pr-3 py-2 bg-gray-100 rounded-full text-sm focus:outline-none"
              placeholder="Search"
            />
            <Search
              size={16}
              className="absolute left-3 top-2.5 text-gray-500"
            />
          </div>
        </div>

        <div className="overflow-y-auto h-full pb-20">
          <div className="hide-scrollbar">
            <div className="px-4 py-2 bg-gray-50">
              <h3 className="text-xs font-medium text-gray-500">
                ONLINE FRIENDS
              </h3>
            </div>

            {loading && <p className="text-center py-4">Loading friends...</p>}
            {error && <p className="text-center py-4 text-red-500">{error}</p>}

            {!loading && !error && friends.length === 0 && (
              <p className="text-center py-4 text-gray-500">
                No friends available.
              </p>
            )}

            {friends.map((friend) => (
              <div
                key={friend._id}
                className="px-4 py-3 border-b hover:bg-gray-50 cursor-pointer"
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

