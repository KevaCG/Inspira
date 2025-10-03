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
      { path: '/community', element: <div>Página de Comunidad Próximamente</div> },
      { path: '/journal', element: <div>Página de Diario Próximamente</div> },
      { path: '/progress', element: <div>Página de Progreso Próximamente</div> },
      { path: '/chat', element: <div>Página de Chat Próximamente</div> },
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