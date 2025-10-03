// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';

// Componentes de Layout
import App from './App.jsx'; // Este será nuestro layout principal CON barra de navegación
import ProtectedRoute from './components/ProtectedRoute.jsx';

// Vistas
import Login from './components/login/Login.jsx';
import Register from './components/register/Register.jsx';
import Home from './components/home/Home.jsx';

import './index.css';
import Profile from './components/Profile/Profile.jsx';
import ChatList from './components/ChatList/ChatList.jsx';
import ChatView from './components/ChatList/ChatView.jsx';
import Progress from './components/Progress/Progress.jsx';
import CommunityMural from './components/CommunityMural/CommunityMural.jsx';
import Journal from './components/Journal/Journal.jsx';

const router = createBrowserRouter([

  {
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '/home',
        element: <Home />,
      },
      { path: '/community', element: <CommunityMural /> },
      { path: '/journal', element: <Journal /> },
      { path: '/progress', element: <Progress /> },
      { path: '/chat', element: <ChatList /> },
      { path: '/chat/:chatId', element: <ChatView /> },
      { path: '/profile', element: <Profile /> },
    ],
  },
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/registro',
    element: <Register />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);