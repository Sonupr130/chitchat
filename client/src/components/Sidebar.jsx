// import { useState, useEffect } from "react";
// import { NavLink, useNavigate } from "react-router-dom";
// import logo from "../assets/logo.png";
// import {
//   CircleDashed,
//   Droplet,
//   House,
//   LogOut,
//   MessageCircle,
//   Plus,
//   Search,
//   Moon,
//   Sun,
//   Image as ImageIcon,
//   UsersRound,
//   UserRoundPlus,
// } from "lucide-react";
// import useAuthStore from "../store/authStore.js";

// const Sidebar = ({ isMobile, onClose }) => {
//   const [darkMode, setDarkMode] = useState(false);
//   const { user, setUser } = useAuthStore(); 
//   const navigate = useNavigate();

//   const toggleDarkMode = () => {
//     setDarkMode(!darkMode);
//   };


//     // Redirect if no user (better to use ProtectedRoute)
//     useEffect(() => {
//       if (!user) {
//         navigate("/");
//       }
//     }, [user, navigate]);

//   console.log("Getting user Sidebar",user);


//   const handleLogout = async () => {
//     try {
//       await useAuthStore.getState().logout();
//       navigate("/");
//     } catch (error) {
//       console.error("Logout failed:", error);
//       alert("Logout failed. Please try again.");
//     }
//   };

  
//   if (!user) return null; 

//   return (
//     <div
//       className={`flex flex-col items-center justify-between py-10 w-[8vw] ${
//         darkMode ? "bg-gray-800" : "bg-[#f9f7fd]"
//       }`}
//     >
//       {/* Logo */}
//       <div className="w-16 h-16 flex items-center justify-center">
//         <img src={logo} alt="logo" className="w-full h-full object-contain" />
//       </div>

//       {/* Navigation Icons */}
//       <div
//         className={`flex flex-col items-center gap-7 w-[70%] rounded-xl py-6 ${
//           darkMode ? "bg-gray-700" : "bg-white shadow-lg"
//         }`}
//       >
//         {/* <NavLink to="#" className={`${darkMode ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-800 hover:text-indigo-600'} transition-colors`}>
//             <House size={20} />
//           </NavLink> */}
//         <NavLink
//           to="/chat"
//           className={`relative ${
//             darkMode
//               ? "text-gray-300 hover:text-indigo-400"
//               : "text-gray-800 hover:text-indigo-600"
//           } transition-colors`}
//         >
//           <MessageCircle size={20} />
//           <span className="absolute top-1 -right-1 block h-2 w-2 bg-green-500 rounded-full ring-2 ring-white"></span>
//         </NavLink>
//         <NavLink
//           to="/online"
//           className={`${
//             darkMode
//               ? "text-gray-300 hover:text-indigo-400"
//               : "text-gray-800 hover:text-indigo-600"
//           } transition-colors`}
//         >
//           <CircleDashed size={20} />
//         </NavLink>
//         {/* <NavLink
//           to="/test"
//           className={`${
//             darkMode
//               ? "text-gray-300 hover:text-indigo-400"
//               : "text-gray-800 hover:text-indigo-600"
//           } transition-colors`}
//         >
//           <Droplet size={20} />
//         </NavLink> */}
//         {/* <NavLink to="#" className={`${darkMode ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-800 hover:text-indigo-600'} transition-colors`}>
//             <Search size={20} />
//           </NavLink>
//           <NavLink to="#" className={`${darkMode ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-800 hover:text-indigo-600'} transition-colors`}>
//             <Plus size={20} />
//           </NavLink> */}
//         <NavLink
//           to="/groups"
//           className={`${
//             darkMode
//               ? "text-gray-300 hover:text-indigo-400"
//               : "text-gray-800 hover:text-indigo-600"
//           } transition-colors`}
//         >
//           <UsersRound size={20} />
//         </NavLink>
//         <NavLink
//           to="/add-friend"
//           className={`${
//             darkMode
//               ? "text-gray-300 hover:text-indigo-400"
//               : "text-gray-800 hover:text-indigo-600"
//           } transition-colors`}
//         >
//           <UserRoundPlus size={20} />
//         </NavLink>
//       </div>

//       {/* Dark Mode Toggle and Logout */}
//       <div className="flex flex-col items-center gap-4">
//         <button
//           onClick={toggleDarkMode}
//           className={`p-3 rounded-full cursor-pointer ${
//             darkMode
//               ? "bg-gray-600 text-yellow-300"
//               : "bg-gray-100 text-gray-700"
//           }`}
//         >
//           {darkMode ? <Sun size={18} /> : <Moon size={18} />}
//         </button>
//         <button
//           onClick={handleLogout}
//           className={`${
//             darkMode
//               ? "text-red-400 hover:text-red-300"
//               : "text-red-600 hover:text-red-800"
//           } transition-colors bg-white p-3 rounded-full cursor-pointer shadow-2xl hover:shadow-2xl ${
//             darkMode ? "hover:shadow-red-400" : "hover:shadow-red-500"
//           }`}
//         >
//           <LogOut size={20} />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;







import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import {
  CircleDashed,
  MessageCircle,
  LogOut,
  Moon,
  Sun,
  UsersRound,
  UserRoundPlus,
} from "lucide-react";
import useAuthStore from "../store/authStore.js";

const Sidebar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const { user, setUser } = useAuthStore();
  const navigate = useNavigate();

  const toggleDarkMode = () => setDarkMode(!darkMode);

  useEffect(() => {
    if (!user) navigate("/");
  }, [user, navigate]);

  const handleLogout = async () => {
    try {
      await useAuthStore.getState().logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed. Please try again.");
    }
  };

  if (!user) return null;

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={`hidden md:flex flex-col items-center justify-between py-10 w-[8vw] fixed h-full z-50 ${
          darkMode ? "bg-gray-800" : "bg-[#f9f7fd]"
        }`}
      >
        {/* Logo */}
        <div className="w-16 h-16 flex items-center justify-center">
          <img src={logo} alt="logo" className="w-full h-full object-contain" />
        </div>

        {/* Middle Nav Icons */}
        <div
          className={`flex flex-col items-center gap-7 w-[70%] rounded-xl py-6 ${
            darkMode ? "bg-gray-700" : "bg-white shadow-lg"
          }`}
        >
          <NavLink
            to="/chat"
            className={`relative ${
              darkMode ? "text-gray-300 hover:text-indigo-400" : "text-gray-800 hover:text-indigo-600"
            } transition-colors`}
          >
            <MessageCircle size={20} />
            <span className="absolute top-1 -right-1 block h-2 w-2 bg-green-500 rounded-full ring-2 ring-white"></span>
          </NavLink>
          <NavLink
            to="/online"
            className={`${
              darkMode ? "text-gray-300 hover:text-indigo-400" : "text-gray-800 hover:text-indigo-600"
            } transition-colors`}
          >
            <CircleDashed size={20} />
          </NavLink>
          <NavLink
            to="/groups"
            className={`${
              darkMode ? "text-gray-300 hover:text-indigo-400" : "text-gray-800 hover:text-indigo-600"
            } transition-colors`}
          >
            <UsersRound size={20} />
          </NavLink>
          <NavLink
            to="/add-friend"
            className={`${
              darkMode ? "text-gray-300 hover:text-indigo-400" : "text-gray-800 hover:text-indigo-600"
            } transition-colors`}
          >
            <UserRoundPlus size={20} />
          </NavLink>
        </div>

        {/* Bottom: Dark Mode and Logout */}
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={toggleDarkMode}
            className={`p-3 rounded-full cursor-pointer ${
              darkMode ? "bg-gray-600 text-yellow-300" : "bg-gray-100 text-gray-700"
            }`}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={handleLogout}
            className={`${
              darkMode ? "text-red-400 hover:text-red-300" : "text-red-600 hover:text-red-800"
            } transition-colors bg-white p-3 rounded-full cursor-pointer shadow-2xl hover:shadow-2xl ${
              darkMode ? "hover:shadow-red-400" : "hover:shadow-red-500"
            }`}
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>

      {/* Mobile: Topbar */}
      <div
        className={`md:hidden fixed top-0 w-full flex justify-between items-center px-4 py-2 z-50 ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900 shadow-md"
        }`}
      >
        {/* Logo */}
        <img src={logo} alt="logo" className="w-10 h-10 object-contain" />

        {/* User Profile (you can replace with actual image or initials later) */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold">{user?.name || "User"}</span>
          <div className="w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center text-xs">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
        </div>

        {/* Toggle + Logout */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${darkMode ? "bg-gray-600 text-yellow-300" : "bg-gray-200 text-gray-700"}`}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={handleLogout}
            className={`p-2 rounded-full ${
              darkMode ? "bg-gray-600 text-red-400" : "bg-gray-200 text-red-600"
            }`}
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>

      {/* Mobile: Bottom Nav */}
      <div
        className={`md:hidden fixed bottom-0 w-full flex justify-around items-center px-6 py-2 z-50 ${
          darkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800 shadow-md"
        }`}
      >
        <NavLink
          to="/chat"
          className={`relative ${darkMode ? "hover:text-indigo-400" : "hover:text-indigo-600"} transition-colors`}
        >
          <MessageCircle size={22} />
          <span className="absolute top-0 right-0 block h-2 w-2 bg-green-500 rounded-full ring-2 ring-white"></span>
        </NavLink>
        <NavLink
          to="/online"
          className={`${darkMode ? "hover:text-indigo-400" : "hover:text-indigo-600"} transition-colors`}
        >
          <CircleDashed size={22} />
        </NavLink>
        <NavLink
          to="/groups"
          className={`${darkMode ? "hover:text-indigo-400" : "hover:text-indigo-600"} transition-colors`}
        >
          <UsersRound size={22} />
        </NavLink>
        <NavLink
          to="/add-friend"
          className={`${darkMode ? "hover:text-indigo-400" : "hover:text-indigo-600"} transition-colors`}
        >
          <UserRoundPlus size={22} />
        </NavLink>
      </div>
    </>
  );
};

export default Sidebar;



