import React from 'react'
import { RouterProvider } from 'react-router-dom';
import router from './routes/index.jsx';
import { useState, useEffect } from 'react';
import useAuthStore from './store/authStore.js';

const App = () => {

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    // Check auth on initial load
    checkAuth();

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [checkAuth]);

  return <RouterProvider router={router} />;
}

export default App;







