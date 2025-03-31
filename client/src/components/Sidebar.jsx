import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import {
  CircleDashed,
  Droplet,
  House,
  LogOut,
  MessageCircle,
  Plus,
  Search,
  Moon,
  Sun,
  Image as ImageIcon,
  UsersRound,
  UserRoundPlus,
} from "lucide-react";
import { auth } from "../config/firebase.js";
import useUserStore from "../store/userStore.js";

const Sidebar = ({ isMobile, onClose }) => {
  const [darkMode, setDarkMode] = useState(false);
  const { user, setUser } = useUserStore(); 
  const navigate = useNavigate();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };


    // Redirect if no user (better to use ProtectedRoute)
    useEffect(() => {
      if (!user) {
        navigate("/");
      }
    }, [user, navigate]);

  // const user = useUserStore((state) => state.user);
  // const setUser = useUserStore((state) => state.setUser);
  console.log("Getting user Sidebar",user);

  // if (!user) {
  //   navigate("/");
  //   return null;
  // }


  const handleLogout = async () => {
    try {
      await useUserStore.getState().logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed. Please try again.");
    }
  };

  
  if (!user) return null; 

  return (
    <div
      className={`flex flex-col items-center justify-between py-10 w-[8vw] ${
        darkMode ? "bg-gray-800" : "bg-[#f9f7fd]"
      }`}
    >
      {/* Logo */}
      <div className="w-16 h-16 flex items-center justify-center">
        <img src={logo} alt="logo" className="w-full h-full object-contain" />
      </div>

      {/* Navigation Icons */}
      <div
        className={`flex flex-col items-center gap-7 w-[70%] rounded-xl py-6 ${
          darkMode ? "bg-gray-700" : "bg-white shadow-lg"
        }`}
      >
        {/* <NavLink to="#" className={`${darkMode ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-800 hover:text-indigo-600'} transition-colors`}>
            <House size={20} />
          </NavLink> */}
        <NavLink
          to="/chat"
          className={`relative ${
            darkMode
              ? "text-gray-300 hover:text-indigo-400"
              : "text-gray-800 hover:text-indigo-600"
          } transition-colors`}
        >
          <MessageCircle size={20} />
          <span className="absolute top-1 -right-1 block h-2 w-2 bg-green-500 rounded-full ring-2 ring-white"></span>
        </NavLink>
        <NavLink
          to="/online"
          className={`${
            darkMode
              ? "text-gray-300 hover:text-indigo-400"
              : "text-gray-800 hover:text-indigo-600"
          } transition-colors`}
        >
          <CircleDashed size={20} />
        </NavLink>
        {/* <NavLink
          to="/test"
          className={`${
            darkMode
              ? "text-gray-300 hover:text-indigo-400"
              : "text-gray-800 hover:text-indigo-600"
          } transition-colors`}
        >
          <Droplet size={20} />
        </NavLink> */}
        {/* <NavLink to="#" className={`${darkMode ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-800 hover:text-indigo-600'} transition-colors`}>
            <Search size={20} />
          </NavLink>
          <NavLink to="#" className={`${darkMode ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-800 hover:text-indigo-600'} transition-colors`}>
            <Plus size={20} />
          </NavLink> */}
        <NavLink
          to="/groups"
          className={`${
            darkMode
              ? "text-gray-300 hover:text-indigo-400"
              : "text-gray-800 hover:text-indigo-600"
          } transition-colors`}
        >
          <UsersRound size={20} />
        </NavLink>
        <NavLink
          to="/add-friend"
          className={`${
            darkMode
              ? "text-gray-300 hover:text-indigo-400"
              : "text-gray-800 hover:text-indigo-600"
          } transition-colors`}
        >
          <UserRoundPlus size={20} />
        </NavLink>
      </div>

      {/* Dark Mode Toggle and Logout */}
      <div className="flex flex-col items-center gap-4">
        <button
          onClick={toggleDarkMode}
          className={`p-3 rounded-full cursor-pointer ${
            darkMode
              ? "bg-gray-600 text-yellow-300"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button
          onClick={handleLogout}
          className={`${
            darkMode
              ? "text-red-400 hover:text-red-300"
              : "text-red-600 hover:text-red-800"
          } transition-colors bg-white p-3 rounded-full cursor-pointer shadow-2xl hover:shadow-2xl ${
            darkMode ? "hover:shadow-red-400" : "hover:shadow-red-500"
          }`}
        >
          <LogOut size={20} />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
