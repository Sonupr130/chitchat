import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';
import MobileHeader from '../components/MobileHeader.jsx';
import { useState } from 'react';

const MainLayout = ({ isMobile }) => {
  const [showSidebar, setShowSidebar] = useState(false);
   const [darkMode, setDarkMode] = useState(false);

   const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className='w-full h-screen'>
      <div className={`h-screen w-screen flex ${darkMode ? 'bg-gray-900 text-white' : 'bg-[#f9f7fd] text-gray-800'} overflow-hidden transition-colors duration-300`}>
      {isMobile && <MobileHeader onMenuClick={() => setShowSidebar(!showSidebar)} />}
      
      <div className="flex flex-1 overflow-hidden">
        {(!isMobile || showSidebar) && (
          <Sidebar 
            isMobile={isMobile} 
            onClose={() => setShowSidebar(false)} 
          />
        )}
        
        <div className="flex flex-col md:flex-row flex-1 gap-4 md:gap-5 p-4 overflow-hidden w-full sm:w-[40vw] md:w-[25vw]">
          <Outlet />
        </div>
      </div>
    </div>
    </div>
  );
};

export default MainLayout;





