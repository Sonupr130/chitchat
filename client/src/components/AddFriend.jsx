// import React, { useState, useEffect } from "react";
// import { Check, Search, UserPlus, X } from "lucide-react";
// import axios from "axios";
// import useAuthStore from "../store/authStore.js";

// const AddFriend = () => {
//   const [darkMode, setDarkMode] = useState(false);
//   const [friendRequests, setFriendRequests] = useState([]);
//   const [suggestedFriends, setSuggestedFriends] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { user, setUser } = useAuthStore();
//   // In your fetchData function:
// const [receivedRequests, setReceivedRequests] = useState([]);
// const [sentRequests, setSentRequests] = useState([]);

//   const toggleDarkMode = () => {
//     setDarkMode(!darkMode);
//   };

//   const defaultImage =
//     "https://photosrush.com/wp-content/uploads/no-love-dp-girl-attitude-for-instagram.jpg";

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const token = localStorage.getItem("token");

//         if (!token) {
//           throw new Error("No authentication token found");
//         }

//         // First ensure we have user data
//         if (!user) {
//           const userData = JSON.parse(localStorage.getItem("user"));
//           if (userData) {
//             setUser(userData);
//           } else {
//             // If no user data, try to verify token
//             const verifyResponse = await axios.get(
//               "http://localhost:8000/api/auth/verify",
//               {
//                 headers: { Authorization: `Bearer ${token}` },
//               }
//             );
//             setUser(verifyResponse.data.user);
//           }
//         }

//         // Only proceed if we have a user ID
//         const currentUserId = user?._id;
//         if (!currentUserId) {
//           throw new Error("User ID not available");
//         }

//         // Fetch friend requests
//         const requestsResponse = await axios.get(
//           "http://localhost:8000/api/user/friend-requests",
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );

//         // Fetch sent friend requests
//         const sentRequestsResponse = await axios.get(
//           "http://localhost:8000/api/user/sent-requests",
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         const transformedRequests = requestsResponse.data.requests.map(
//           (request) => ({
//             _id: request._id,
//             name: request.name,
//             email: request.email,
//             image: request.photo || defaultImage,
//             status: request.status,
//             lastSeen: request.lastSeen,
//             isReceived: true, // Mark as received request
//           })
//         );

//         // Transform sent requests
//         const transformedSentRequests = sentRequestsResponse.data.requests.map(
//           (request) => ({
//             _id: request._id,
//             name: request.name,
//             email: request.email,
//             image: request.photo || defaultImage,
//             status: request.status,
//             lastSeen: request.lastSeen,
//             isReceived: false, // Mark as sent request
//           })
//         );

//         // Combine both received and sent requests
//         setFriendRequests([...transformedRequests, ...transformedSentRequests]);

//         // Fetch all users for suggestions
//         const usersResponse = await axios.get(
//           "http://localhost:8000/api/user/all-users",
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );

//         // THIS IS WHERE YOU PUT THE CODE
//         const suggested =
//           usersResponse.data.users
//             ?.filter((u) => u._id !== currentUserId)
//             ?.map((user) => ({
//               _id: user._id.toString(),
//               name: user.name,
//               email: user.email,
//               image: user.photo || defaultImage,
//               mutualFriends: user.friends?.length || 0,
//               isRequestSent: user.isRequestSent || false,
//             })) || [];

//         setSuggestedFriends(suggested);
//       } catch (err) {
//         console.error("Fetch error:", err);
//         setError(err.response?.data?.message || err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [user, setUser]);

//   const handleAddFriend = async (friendId) => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) throw new Error("No authentication token found");

//       // Ensure friendId exists and is valid
//       if (!friendId) {
//         throw new Error("No friend ID provided");
//       }

//       // Convert to string safely
//       const friendIdStr = friendId.toString
//         ? friendId.toString()
//         : String(friendId);

//       const response = await axios.post(
//         "http://localhost:8000/api/user/add-friend",
//         { friendId: friendIdStr },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       if (response.data.success) {
//         setSuggestedFriends((prev) =>
//           prev.map((user) =>
//             user._id === friendIdStr ? { ...user, isRequestSent: true } : user
//           )
//         );
//         alert("Friend request sent successfully!");
//       } else {
//         throw new Error(response.data.message || "Failed to add friend");
//       }
//     } catch (error) {
//       console.error("Add friend error:", error);
//       alert(error.response?.data?.message || error.message);
//     }
//   };

//   const handleAcceptRequest = async (requestId) => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) throw new Error("No authentication token found");

//       await axios.post(
//         "http://localhost:8000/api/user/accept-request",
//         { requestId: requestId.toString() }, // Ensure string ID
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setFriendRequests(
//         (prev) => prev.filter((request) => request._id !== requestId) // Changed from id to _id
//       );

//       setSuggestedFriends((prev) =>
//         prev.map((user) =>
//           user._id === requestId // Changed from id to _id
//             ? { ...user, isFriend: true }
//             : user
//         )
//       );
//     } catch (error) {
//       console.error("Error accepting friend request:", error);
//       alert("Failed to accept friend request. Please try again.");
//     }
//   };

//   const handleRejectRequest = async (requestId) => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) throw new Error("No authentication token found");

//       await axios.post(
//         "http://localhost:8000/api/user/reject-request",
//         { requestId: requestId.toString() }, // Ensure string ID
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setFriendRequests(
//         (prev) => prev.filter((request) => request._id !== requestId) // Changed from id to _id
//       );
//     } catch (error) {
//       console.error("Error rejecting friend request:", error);
//       alert("Failed to reject friend request. Please try again.");
//     }
//   };

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
//           {/* Friend Requests Section */}
//           <div className="px-4 py-2 bg-gray-50 border-b">
//             <h3 className="text-xs font-medium text-gray-500">
//               FRIEND REQUESTS ({friendRequests.length})
//             </h3>
//           </div>

//           <div className="hide-scrollbar">
//             {friendRequests.length > 0 ? (
//               friendRequests.map((request) => (
//                 <div
//                   key={request._id}
//                   className="px-4 py-3 border-b hover:bg-gray-50"
//                 >
//                   <div className="flex items-center">
//                     <div className="flex-shrink-0">
//                       <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden flex items-center justify-center">
//                         <img
//                           src={request.image}
//                           alt={request.name}
//                           className="object-cover w-full h-full"
//                         />
//                       </div>
//                     </div>
//                     <div className="ml-3 flex-1">
//                       <h3 className="text-sm font-medium">{request.name}</h3>
//                       <p className="text-xs text-gray-500 capitalize">
//                         {request.status || "offline"}
//                         {!request.isReceived && " • Request sent"}
//                       </p>
//                     </div>
//                     {request.isReceived ? (
//                       <div className="flex gap-1">
//                         <button
//                           className="p-1 bg-green-600 text-white rounded-full mr-1"
//                           onClick={() => handleAcceptRequest(request._id)}
//                         >
//                           <Check size={16} />
//                         </button>
//                         <button
//                           className="p-1 bg-red-500 text-white rounded-full"
//                           onClick={() => handleRejectRequest(request._id)}
//                         >
//                           <X size={16} />
//                         </button>
//                       </div>
//                     ) : (
//                       <div className="text-xs text-gray-500 px-2">Pending</div>
//                     )}
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

//             {/* Suggested Friends Section */}
//             <div className="px-4 py-2 bg-gray-50 border-b mt-4">
//               <h3 className="text-xs font-medium text-gray-500">
//                 PEOPLE YOU MAY KNOW ({suggestedFriends.length})
//               </h3>
//             </div>

//             {suggestedFriends.length > 0 ? (
//               suggestedFriends.map((user) => (
//                 <div
//                   key={user._id}
//                   className="px-4 py-3 border-b hover:bg-gray-50"
//                 >
//                   <div className="flex items-center">
//                     <div className="flex-shrink-0">
//                       <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden flex items-center justify-center">
//                         <img
//                           src={user.image}
//                           alt={user.name}
//                           className="object-cover w-full h-full"
//                         />
//                       </div>
//                     </div>
//                     <div className="ml-3 flex-1">
//                       <h3 className="text-sm font-medium">{user.name}</h3>
//                       {user.mutualFriends > 0 && (
//                         <p className="text-xs text-gray-500">
//                           {user.mutualFriends} mutual friends
//                         </p>
//                       )}
//                     </div>
//                     <button
//                       onClick={() => handleAddFriend(user._id)}
//                       disabled={user.isRequestSent}
//                       className={`p-1 rounded-full ${
//                         user.isRequestSent
//                           ? "bg-green-100 text-green-600"
//                           : "bg-gray-200 text-blue-600 hover:bg-gray-300"
//                       }`}
//                     >
//                       <UserPlus size={16} />
//                     </button>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="px-4 py-6 text-center">
//                 <p className="text-sm text-gray-500">
//                   No suggested friends found
//                 </p>
//               </div>
//             )}

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
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [suggestedFriends, setSuggestedFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, setUser } = useAuthStore();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const defaultImage = "https://photosrush.com/wp-content/uploads/no-love-dp-girl-attitude-for-instagram.jpg";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No authentication token found");

        // First ensure we have user data
        if (!user) {
          const userData = JSON.parse(localStorage.getItem("user"));
          if (userData) {
            setUser(userData);
          } else {
            const verifyResponse = await axios.get(
              "http://localhost:8000/api/auth/verify",
              { headers: { Authorization: `Bearer ${token}` } }
            );
            setUser(verifyResponse.data.user);
          }
        }

        // Only proceed if we have a user ID
        const currentUserId = user?._id;
        if (!currentUserId) throw new Error("User ID not available");

        // Fetch all data in parallel
        const [requestsResponse, sentResponse, usersResponse] = await Promise.all([
          axios.get("http://localhost:8000/api/user/friend-requests", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("http://localhost:8000/api/user/sent-requests", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("http://localhost:8000/api/user/all-users", { headers: { Authorization: `Bearer ${token}` } })
        ]);

        // Transform received requests
        setReceivedRequests(
          requestsResponse.data.requests.map(request => ({
            _id: request._id,
            name: request.name,
            email: request.email,
            image: request.photo || defaultImage,
            status: request.status,
            lastSeen: request.lastSeen
          }))
        );

        // Transform sent requests
        setSentRequests(
          sentResponse.data.requests.map(request => ({
            _id: request._id,
            name: request.name,
            email: request.email,
            image: request.photo || defaultImage,
            status: request.status,
            lastSeen: request.lastSeen,
            createdAt: request.createdAt // Add timestamp if available
          }))
        );

        // Transform suggested friends
        setSuggestedFriends(
          usersResponse.data.users
            ?.filter(u => u._id !== currentUserId)
            ?.map(user => ({
              _id: user._id.toString(),
              name: user.name,
              email: user.email,
              image: user.photo || defaultImage,
              mutualFriends: user.friends?.length || 0,
              isRequestSent: user.isRequestSent || false
            })) || []
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
        // Refresh sent requests
        const sentResponse = await axios.get(
          "http://localhost:8000/api/user/sent-requests",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSentRequests(sentResponse.data.requests);
      }
    } catch (error) {
      console.error("Add friend error:", error);
      alert(error.response?.data?.message || error.message);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      await axios.post(
        "http://localhost:8000/api/user/accept-request",
        { requestId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setReceivedRequests(prev => prev.filter(req => req._id !== requestId));
      // You might want to refresh friends list here
    } catch (error) {
      console.error("Error accepting friend request:", error);
      alert("Failed to accept friend request. Please try again.");
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      await axios.post(
        "http://localhost:8000/api/user/reject-request",
        { requestId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setReceivedRequests(prev => prev.filter(req => req._id !== requestId));
    } catch (error) {
      console.error("Error rejecting friend request:", error);
      alert("Failed to reject friend request. Please try again.");
    }
  };

  const handleCancelRequest = async (requestId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      await axios.post(
        "http://localhost:8000/api/user/cancel-request",
        { requestId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSentRequests(prev => prev.filter(req => req._id !== requestId));
    } catch (error) {
      console.error("Error canceling friend request:", error);
      alert("Failed to cancel friend request. Please try again.");
    }
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className={`${darkMode ? "bg-gray-800" : "bg-white"} w-[25vw] rounded-lg shadow-sm overflow-hidden`}>
      <div className="flex flex-col h-full">
        <div className="p-4 border-b">
          <h1 className="text-lg font-semibold">Create New Bonds</h1>
        </div>

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

        <div className="overflow-y-auto h-full pb-20">
          {/* Received Requests Section */}
          <div className="px-4 py-2 bg-gray-50 border-b">
            <h3 className="text-xs font-medium text-gray-500">
              RECEIVED REQUESTS ({receivedRequests.length})
            </h3>
          </div>

          {receivedRequests.length > 0 ? (
            receivedRequests.map(request => (
              <div key={request._id} className="px-4 py-3 border-b hover:bg-gray-50">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <img src={request.image} alt={request.name} className="w-10 h-10 rounded-full" />
                  </div>
                  <div className="ml-3 flex-1">
                    <h3 className="text-sm font-medium">{request.name}</h3>
                    <p className="text-xs text-gray-500">{request.status || "offline"}</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => handleAcceptRequest(request._id)} className="p-1 bg-green-600 text-white rounded-full">
                      <Check size={16} />
                    </button>
                    <button onClick={() => handleRejectRequest(request._id)} className="p-1 bg-red-500 text-white rounded-full">
                      <X size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-4 py-6 text-center">
              <p className="text-sm text-gray-500">No received requests</p>
            </div>
          )}

          {/* Sent Requests Section */}
          <div className="px-4 py-2 bg-gray-50 border-b mt-4">
            <h3 className="text-xs font-medium text-gray-500">
              SENT REQUESTS ({sentRequests.length})
            </h3>
          </div>

          {sentRequests.length > 0 ? (
            sentRequests.map(request => (
              <div key={request._id} className="px-4 py-3 border-b hover:bg-gray-50">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <img src={request.image} alt={request.name} className="w-10 h-10 rounded-full" />
                  </div>
                  <div className="ml-3 flex-1">
                    <h3 className="text-sm font-medium">{request.name}</h3>
                    <p className="text-xs text-gray-500">Pending since {new Date(request.createdAt).toLocaleDateString()}</p>
                  </div>
                  <button 
                    onClick={() => handleCancelRequest(request._id)}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="px-4 py-6 text-center">
              <p className="text-sm text-gray-500">No sent requests</p>
            </div>
          )}

          {/* Suggested Friends Section */}
          <div className="px-4 py-2 bg-gray-50 border-b mt-4">
            <h3 className="text-xs font-medium text-gray-500">
              PEOPLE YOU MAY KNOW ({suggestedFriends.length})
            </h3>
          </div>

          {suggestedFriends.length > 0 ? (
            suggestedFriends.map(user => (
              <div key={user._id} className="px-4 py-3 border-b hover:bg-gray-50">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <img src={user.image} alt={user.name} className="w-10 h-10 rounded-full" />
                  </div>
                  <div className="ml-3 flex-1">
                    <h3 className="text-sm font-medium">{user.name}</h3>
                    {user.mutualFriends > 0 && (
                      <p className="text-xs text-gray-500">{user.mutualFriends} mutual friends</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleAddFriend(user._id)}
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
              <p className="text-sm text-gray-500">No suggested friends found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddFriend;
