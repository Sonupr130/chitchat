// import { create } from "zustand";

// const useUserStore = create((set) => ({
//   user: null,
//   setUser: (user) => set({ user }),
// }));

// export default useUserStore;








// src/store/authStore.js
import { create } from "zustand";
import axios from "axios";
import { auth } from "../config/firebase.js";

const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  
  // Add methods for authentication
  checkAuth: async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        set({ loading: false });
        return;
      }
      
      // Verify token with backend
      const response = await axios.get("http://localhost:8000/api/auth/verify", {
        headers: { Authorization: `Bearer ${token}` }
      });
        set({ user: response.data.user, loading: false });
    } catch (error) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      set({ user: null, loading: false });
    } finally {
      set({ loading: false });
    }
  },
  
  login: (userData) => {
    localStorage.setItem("token", userData.token);
    localStorage.setItem("user", JSON.stringify(userData.user));
    set({ user: userData.user });
  },
  
  logout: async () => {
    try {
      await auth.signOut();
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      set({ user: null });
    } catch (error) {
      console.error("Firebase signout failed:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      set({ user: null });
    }
  }
}));

export default useAuthStore;