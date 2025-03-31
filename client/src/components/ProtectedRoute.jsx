// import { Navigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext.jsx";



// const ProtectedRoute = ({ children }) => {
//   const { user, loading } = useAuth();

//   if (loading) return <div>Loading...</div>;
//   return user ? children : <Navigate to="/" />;
// };

// export default ProtectedRoute;


import { Navigate } from "react-router-dom";
import useAuthStore from "../store/userStore.js";
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuthStore();

  // Show loading indicator while checking auth state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If not loading but no user, redirect to login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // If user is authenticated, render children
  return children;
};

export default ProtectedRoute;