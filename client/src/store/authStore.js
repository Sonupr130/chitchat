// import { create } from "zustand";
// import axios from "axios";
// import { auth } from "../config/firebase.js";
// import useChatStore from "./chatStore.js";


// const useAuthStore = create((set) => ({
//   user: JSON.parse(localStorage.getItem('user')) || null,
//   loading: true,
  
//   setUser: (user) => {
//     if (user) {
//       localStorage.setItem('user', JSON.stringify(user));
//     } else {
//       localStorage.removeItem('user');
//     }
//     set({ user });
//   },
  
//   setLoading: (loading) => set({ loading }),
  
//   checkAuth: async () => {
//     try {
//       set({ loading: true });
//       const token = localStorage.getItem("token");
//       const savedUser = JSON.parse(localStorage.getItem('user'));
      
//       if (!token) {
//         set({ user: null, loading: false });
//         return;
//       }
      
//       // First set the saved user to avoid flash of unauthenticated content
//       if (savedUser) {
//         set({ user: savedUser });
//       }

//       // Then verify with backend
//       const { data } = await axios.get("http://localhost:8000/api/auth/verify", {
//         headers: { Authorization: `Bearer ${token}` }
//       });
      
//       if (data.success) {
//         localStorage.setItem('user', JSON.stringify(data.user));
//         set({ user: data.user, loading: false });
//       } else {
//         throw new Error("Verification failed");
//       }
//     } catch (error) {
//       console.error("Auth verification failed:", error);
//       localStorage.removeItem("token");
//       localStorage.removeItem("user");
//       set({ user: null, loading: false });
//     }
//   },
  
//   login: (userData) => {
//     localStorage.setItem("token", userData.token);
//     localStorage.setItem("user", JSON.stringify(userData.user));
//     set({ user: userData.user });
//   },
  
//   logout: async () => {
//     try {
//       await auth.signOut();
//     } catch (error) {
//       console.error("Firebase signout failed:", error);
//     } finally {
//       localStorage.removeItem("token");
//       localStorage.removeItem("user");
//       set({ user: null });
//     }
//   },



 
// }));

// export default useAuthStore;






// authStore.js
import { create } from "zustand";
import axios from "axios";
import { auth } from "../config/firebase.js";
import useChatStore from "./chatStore.js";

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  loading: true,
  
  setUser: (user) => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
    set({ user });
  },
  
  setLoading: (loading) => set({ loading }),
  
  checkAuth: async () => {
    try {
      set({ loading: true });
      const token = localStorage.getItem("token");
      const savedUser = JSON.parse(localStorage.getItem('user'));
      
      if (!token) {
        set({ user: null, loading: false });
        return;
      }
      
      // First set the saved user to avoid flash of unauthenticated content
      if (savedUser) {
        set({ user: savedUser });
      }

      // Then verify with backend
      const { data } = await axios.get("http://localhost:8000/api/auth/verify", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        set({ user: data.user, loading: false });
        
        // Fetch chats after successful authentication
        await fetchChats(token);
      } else {
        throw new Error("Verification failed");
      }
    } catch (error) {
      console.error("Auth verification failed:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      set({ user: null, loading: false });
    }
  },
  
  login: async (userData) => {
    localStorage.setItem("token", userData.token);
    localStorage.setItem("user", JSON.stringify(userData.user));
    set({ user: userData.user });
    
    // Fetch chats after login
    await fetchChats(userData.token);
  },
  
  logout: async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Firebase signout failed:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      set({ user: null });
      // Clear chat store on logout
      useChatStore.setState({ chats: [] });
    }
  },
}));

// Separate function to fetch chats
const fetchChats = async (token) => {
  try {
    const response = await axios.get("http://localhost:8000/api/user/chats", {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success) {
      useChatStore.setState({ chats: response.data.chats });
    }
  } catch (error) {
    console.error('Error fetching chats:', error);
  }
};

export default useAuthStore;