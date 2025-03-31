// import React, { useState, useEffect } from "react";
// import { Check, Search, UserPlus, X } from "lucide-react";
// import axios from "axios";
// import useUserStore from "../store/userStore.js";

// const AddFriend = () => {
//   const [darkMode, setDarkMode] = useState(false);
//   const [friendRequests, setFriendRequests] = useState([]);
//   const [suggestedFriends, setSuggestedFriends] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { user, setUser } = useUserStore();

//   const toggleDarkMode = () => {
//     setDarkMode(!darkMode);
//   };

//   // const friendRequests = [
//   //   { id: 1, name: "Akshay Kumar", mutualFriends: 3 },
//   //   { id: 2, name: "Divya Sharma", mutualFriends: 5 },
//   // ];

//   const defaultImage =
//     "https://photosrush.com/wp-content/uploads/no-love-dp-girl-attitude-for-instagram.jpg";

//   // Initialize user and fetch suggested friends
//   useEffect(() => {
//     const initializeAuthAndFetchUsers = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         // console.log("Add Friend side Token Recived ", token);
//         if (token && !user) {
//           // Verify token with backend if needed
//           const userData = JSON.parse(localStorage.getItem("user"));
//           setUser(userData);
//         }

//         if (!token) {
//           throw new Error("No authentication token found");
//         }

//         const response = await axios.get(
//           "http://localhost:8000/api/user/all-users",
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         console.log(response);

//         // Check if response.data is an array or contains a users array
//         const usersArray = Array.isArray(response.data)
//           ? response.data
//           : response.data.users || [];

//         const transformedUsers = usersArray.map((user) => ({
//           id: user._id,
//           name: user.name,
//           image: user.photo || defaultImage,
//           mutualFriends: user.friends?.length || 0,
//         }));
//         console.log("Trans Users:", transformedUsers);
//         setSuggestedFriends(transformedUsers);

//         // const transformedUsers = response.data.map((user) => ({
//         //   id: user._id,
//         //   name: user.name,
//         //   image: user.photo || defaultImage, // Fallback to defaultImage
//         //   mutualFriends: user.friends?.length || 0,
//         // }));
//         // setSuggestedFriends(transformedUsers);
//         // setFriendRequests(users.slice(0, 2));
//       } catch (err) {
//         const errorMessage = err.response
//           ? `Server responded with status ${err.response.status}`
//           : err.message;
//         setError(errorMessage);
//         console.error("Error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     initializeAuthAndFetchUsers();
//   }, [setUser, user]);

//   if (loading) {
//     return (
//       <div
//         className={`${
//           darkMode ? "bg-gray-800" : "bg-white"
//         } w-[25vw] rounded-lg shadow-sm overflow-hidden`}
//       >
//         <div className="p-4">Loading...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div
//         className={`${
//           darkMode ? "bg-gray-800" : "bg-white"
//         } w-[25vw] rounded-lg shadow-sm overflow-hidden`}
//       >
//         <div className="p-4 text-red-500">Error: {error}</div>
//       </div>
//     );
//   }

//   const handleAddFriend = async (friendId) => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) throw new Error("No authentication token found");

//       const response = await axios.post(
//         "http://localhost:8000/api/user/add-friend",
//         { friendId },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       // Update the suggested friends list
//       setSuggestedFriends((prev) =>
//         prev.map((user) =>
//           user.id === friendId ? { ...user, isRequestSent: true } : user
//         )
//       );

//       // Update friend requests
//       const newRequest = {
//         id: friendId,
//         name:
//           suggestedFriends.find((u) => u.id === friendId)?.name || "New Friend",
//         mutualFriends: 0,
//         isPending: true,
//       };

//       setFriendRequests((prev) => [...prev, newRequest]);
//     } catch (error) {
//       console.error("Error adding friend:", error);
//       alert("Failed to add friend. Please try again.");
//     }
//   };


//   const handleAcceptRequest = async (requestId) => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) throw new Error('No authentication token found');
  
//       const response = await axios.post(
//         'http://localhost:8000/api/user/accept-request',
//         { requestId },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
  
//       // Update the friend requests list
//       setFriendRequests(prev => 
//         prev.filter(request => request.id !== requestId)
//       );
  
//       // Update the friends list in your state if needed
//       // setFriends(prev => [...prev, response.data.newFriend]);
  
//     } catch (error) {
//       console.error('Error accepting friend request:', error);
//       alert('Failed to accept friend request. Please try again.');
//     }
//   };
  
//   const handleRejectRequest = async (requestId) => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) throw new Error('No authentication token found');
  
//       await axios.post(
//         'http://localhost:8000/api/user/reject-request',
//         { requestId },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
  
//       // Update the friend requests list
//       setFriendRequests(prev => 
//         prev.filter(request => request.id !== requestId)
//       );
  
//     } catch (error) {
//       console.error('Error rejecting friend request:', error);
//       alert('Failed to reject friend request. Please try again.');
//     }
//   };

//   return (
//     <div
//       className={`${
//         darkMode ? "bg-gray-800" : "bg-white"
//       } w-[25vw] rounded-lg shadow-sm overflow-hidden`}
//     >
//       <div className="flex flex-col h-full">
//         <div className="p-4 border-b">
//           <h1 className="text-lg font-semibold">Create New Bonds</h1>
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

//         <div className="overflow-y-auto h-full pb-20 hide-scrollbar">
//           <div className="px-4 py-2 bg-gray-50 border-b">
//             <h3 className="text-xs font-medium text-gray-500">
//               FRIEND REQUESTS
//             </h3>
//           </div>

//           <div className="hide-scrollbar">
//             {/* {friendRequests.length > 0 ? (
//               friendRequests.map((request) => (
//                 <div
//                   key={request.id}
//                   className="px-4 py-3 border-b hover:bg-gray-50"
//                 >
//                   <div className="flex items-center">
//                     <div className="flex-shrink-0">
//                       <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden flex items-center justify-center">
//                         <img
//                           src={request.image || defaultImage}
//                           alt={request.name}
//                           className="object-cover"
//                         />
//                       </div>
//                     </div>
//                     <div className="ml-3 flex-1">
//                       <h3 className="text-sm font-medium">{request.name}</h3>
//                       <p className="text-xs text-gray-500">
//                         {request.mutualFriends} mutual friends
//                       </p>
//                     </div>
//                     <div className="flex gap-1">
//                       <button className="p-1 bg-green-600 text-white rounded-full mr-1">
//                         <Check size={16} />
//                       </button>
//                       <button className="p-1 bg-red-500 text-white rounded-full">
//                         <X size={16} />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="px-4 py-6 text-center">
//                 <p className="text-sm text-gray-500">
//                   No pending friend requests
//                 </p>
//               </div>
//             )} */}

//             {friendRequests.length > 0 ? (
//               friendRequests.map((request) => (
//                 <div
//                   key={request.id}
//                   className="px-4 py-3 border-b hover:bg-gray-50"
//                 >
//                   <div className="flex items-center">
//                     <div className="flex-shrink-0">
//                       <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden flex items-center justify-center">
//                         <img
//                           src={request.image || defaultImage}
//                           alt={request.name}
//                           className="object-cover"
//                         />
//                       </div>
//                     </div>
//                     <div className="ml-3 flex-1">
//                       <h3 className="text-sm font-medium">{request.name}</h3>
//                       <p className="text-xs text-gray-500">
//                         {request.mutualFriends} mutual friends
//                       </p>
//                     </div>
//                     <div className="flex gap-1">
//                       {request.isPending ? (
//                         <span className="text-xs text-gray-500">
//                           Request Sent
//                         </span>
//                       ) : (
//                         <>
//                           <button
//                             className="p-1 bg-green-600 text-white rounded-full mr-1"
//                             onClick={() => handleAcceptRequest(request.id)}
//                           >
//                             <Check size={16} />
//                           </button>
//                           <button
//                             className="p-1 bg-red-500 text-white rounded-full"
//                             onClick={() => handleRejectRequest(request.id)}
//                           >
//                             <X size={16} />
//                           </button>
//                         </>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="px-4 py-6 text-center">
//                 <p className="text-sm text-gray-500">
//                   No pending friend requests
//                 </p>
//               </div>
//             )}

//             {/* Find Friends section */}
//             <div className="px-4 py-2 bg-gray-50 border-b mt-4">
//               <h3 className="text-xs font-medium text-gray-500">
//                 PEOPLE YOU MAY KNOW
//               </h3>
//             </div>

//             {/* // suggestedFriends */}
//             {suggestedFriends.map((user) => (
//               <div
//                 key={user.id}
//                 className="px-4 py-3 border-b hover:bg-gray-50"
//               >
//                 <div className="flex items-center">
//                   <div className="flex-shrink-0">
//                     <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden flex items-center justify-center">
//                       <img
//                         src={user.image || defaultImage}
//                         alt={user.name}
//                         className="object-cover"
//                       />
//                     </div>
//                   </div>
//                   <div className="ml-3 flex-1">
//                     <h3 className="text-sm font-medium">{user.name}</h3>
//                     <p className="text-xs text-gray-500">
//                       {user.mutualFriends > 0 && (
//                         <p className="text-xs text-gray-500">
//                           {user.mutualFriends} mutual friends
//                         </p>
//                       )}
//                     </p>
//                   </div>
//                   <button
//                     onClick={() => handleAddFriend(user.id)}
//                     disabled={user.isRequestSent}
//                     className={`p-1 bg-gray-200 text-blue-600 rounded-full ${
//                       user.isRequestSent
//                         ? "bg-green-100 text-green-600"
//                         : "bg-gray-200 text-blue-600"
//                     }`}
//                   >
//                     <UserPlus size={16} />
//                   </button>
//                 </div>
//               </div>
//             ))}

//             {/* Find more friends button */}
//             <div className="p-4">
//               <button className="w-full py-2 bg-gray-200 text-blue-600 rounded-md text-sm font-medium hover:bg-gray-300 flex items-center justify-center">
//                 <Search size={16} className="mr-1" />
//                 Find More Friends
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddFriend;






import React, { useState, useEffect } from "react";
import { Check, Search, UserPlus, X } from "lucide-react";
import axios from "axios";
import useAuthStore from "../store/authStore.js";

const AddFriend = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [friendRequests, setFriendRequests] = useState([]);
  const [suggestedFriends, setSuggestedFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, setUser } = useAuthStore();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const defaultImage ="https://photosrush.com/wp-content/uploads/no-love-dp-girl-attitude-for-instagram.jpg";

  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        
        if (!token) {
          throw new Error("No authentication token found");
        }
  
        // First ensure we have user data
        if (!user) {
          const userData = JSON.parse(localStorage.getItem("user"));
          if (userData) {
            setUser(userData);
          } else {
            // If no user data, try to verify token
            const verifyResponse = await axios.get(
              "http://localhost:8000/api/auth/verify",
              {
                headers: { Authorization: `Bearer ${token}` }
              }
            );
            setUser(verifyResponse.data.user);
          }
        }
  
        // Only proceed if we have a user ID
        if (!user?._id) {
          throw new Error("User ID not available");
        }
  
        // Fetch friend requests
        const requestsResponse = await axios.get(
          "http://localhost:8000/api/user/friend-requests",
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        
        const transformedRequests = requestsResponse.data.requests.map(request => ({
          _id: request._id, // Changed from id to _id
          name: request.name,
          email: request.email, // Added email if needed
          image: request.photo || defaultImage,
          status: request.status,
          lastSeen: request.lastSeen
        }));
  
        setFriendRequests(transformedRequests);
  
        // Fetch all users for suggestions
        const usersResponse = await axios.get(
          "http://localhost:8000/api/user/all-users",
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [user, setUser]); 

 
  const handleAddFriend = async (friendId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");
  
      const response = await axios.post(
        "http://localhost:8000/api/user/add-friend",
        { friendId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (response.data.success) {
        setSuggestedFriends(prev =>
          prev.map(user =>
            user._id === friendId ? { ...user, isRequestSent: true } : user
          )
        );
      } else {
        throw new Error(response.data.message || "Failed to add friend");
      }
    } catch (error) {
      console.error("Add friend error:", error);
      alert(error.message);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      await axios.post(
        'http://localhost:8000/api/user/accept-request',
        { requestId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update both friendRequests and suggestedFriends state
      setFriendRequests(prev => 
        prev.filter(request => request.id !== requestId)
      );
      
      setSuggestedFriends(prev => 
        prev.map(user => 
          user.id === requestId 
            ? { ...user, isFriend: true } 
            : user
        )
      );

    } catch (error) {
      console.error('Error accepting friend request:', error);
      alert('Failed to accept friend request. Please try again.');
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      await axios.post(
        'http://localhost:8000/api/user/reject-request',
        { requestId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFriendRequests(prev => 
        prev.filter(request => request.id !== requestId)
      );

    } catch (error) {
      console.error('Error rejecting friend request:', error);
      alert('Failed to reject friend request. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className={`${darkMode ? "bg-gray-800" : "bg-white"} w-[25vw] rounded-lg shadow-sm overflow-hidden`}>
        <div className="p-4">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${darkMode ? "bg-gray-800" : "bg-white"} w-[25vw] rounded-lg shadow-sm overflow-hidden`}>
        <div className="p-4 text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className={`${darkMode ? "bg-gray-800" : "bg-white"} w-[25vw] rounded-lg shadow-sm overflow-hidden`}>
      <div className="flex flex-col h-full">
        <div className="p-4 border-b">
          <h1 className="text-lg font-semibold">Create New Bonds</h1>
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

        <div className="overflow-y-auto h-full pb-20 hide-scrollbar">
          {/* Friend Requests Section */}
          <div className="px-4 py-2 bg-gray-50 border-b">
            <h3 className="text-xs font-medium text-gray-500">
              FRIEND REQUESTS ({friendRequests.length})
            </h3>
          </div>

          <div className="hide-scrollbar">
            {friendRequests.length > 0 ? (
              friendRequests.map((request) => (
                <div
                  key={request.id}
                  className="px-4 py-3 border-b hover:bg-gray-50"
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden flex items-center justify-center">
                        <img
                          src={request.image}
                          alt={request.name}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </div>
                    <div className="ml-3 flex-1">
                      <h3 className="text-sm font-medium">{request.name}</h3>
                      <p className="text-xs text-gray-500 capitalize">
                        {request.status || "offline"}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        className="p-1 bg-green-600 text-white rounded-full mr-1"
                        onClick={() => handleAcceptRequest(request.id)}
                      >
                        <Check size={16} />
                      </button>
                      <button
                        className="p-1 bg-red-500 text-white rounded-full"
                        onClick={() => handleRejectRequest(request.id)}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-6 text-center">
                <p className="text-sm text-gray-500">
                  No pending friend requests
                </p>
              </div>
            )}

            {/* Suggested Friends Section */}
            <div className="px-4 py-2 bg-gray-50 border-b mt-4">
              <h3 className="text-xs font-medium text-gray-500">
                PEOPLE YOU MAY KNOW ({suggestedFriends.length})
              </h3>
            </div>

            {suggestedFriends.length > 0 ? (
              suggestedFriends.map((user) => (
                <div
                  key={user.id}
                  className="px-4 py-3 border-b hover:bg-gray-50"
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden flex items-center justify-center">
                        <img
                          src={user.image}
                          alt={user.name}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </div>
                    <div className="ml-3 flex-1">
                      <h3 className="text-sm font-medium">{user.name}</h3>
                      {user.mutualFriends > 0 && (
                        <p className="text-xs text-gray-500">
                          {user.mutualFriends} mutual friends
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleAddFriend(user.id)}
                      disabled={user.isRequestSent}
                      className={`p-1 rounded-full ${
                        user.isRequestSent
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-200 text-blue-600 hover:bg-gray-300"
                      }`}
                    >
                      <UserPlus size={16} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-6 text-center">
                <p className="text-sm text-gray-500">
                  No suggested friends found
                </p>
              </div>
            )}

            {/* Find more friends button */}
            <div className="p-4">
              <button className="w-full py-2 bg-gray-200 text-blue-600 rounded-md text-sm font-medium hover:bg-gray-300 flex items-center justify-center">
                <Search size={16} className="mr-1" />
                Find More Friends
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFriend;