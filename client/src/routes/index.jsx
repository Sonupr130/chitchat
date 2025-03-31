import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout.jsx';
import LandingPage from '../pages/LandingPage.jsx';
import AboutPage from '../pages/AboutPage.jsx';
import ChatArea from '../components/ChatArea.jsx';
import ChatsPage from '../pages/ChatPage.jsx';
import Groups from '../components/Groups.jsx';
import AddFriend from '../components/AddFriend.jsx';
import Online from '../components/Online.jsx';
import ProtectedRoute from '../components/ProtectedRoute.jsx';



const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />, // Standalone, no layout
  },
  {
    path: 'about',
    element: <AboutPage />,
  },

  {
    path: '/',
    // element: <MainLayout />, 
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'chat',
        element: <ChatsPage />,
        children: [
          {
            index: true, // Default view when no chatId is selected
            element: <ChatArea defaultMode="welcome" />, // Optional: Add a "welcome" state
          },
          {
            path: ':chatId', // For specific chats
            element: <ChatArea />,
          },
        ],
      },
      {
        path: 'groups',
        element: <Groups />,
      },
      {
        path: 'add-friend',
        element: <AddFriend />,
      },
      {
        path: 'online',
        element: <Online />,
      },
    ],
  },
]);


export default router;