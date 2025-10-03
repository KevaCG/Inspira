import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import './App.css';
import BottomNav from './components/BottomNav/BottomNav';
import Sidebar from './components/Sidebar/Sidebar';
import Header from './components/Header/Header';

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // 1. Función específica para cerrar el menú (más claro)
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="App">
      {/* 2. Overlay que aparece cuando el menú está abierto y permite cerrarlo */}
      {isSidebarOpen && <div className="overlay" onClick={closeSidebar}></div>}

      {/* 3. Pasamos la función 'onClose' al Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      
      <div className="main-content-wrapper">
        <Header 
          isMenuOpen={isSidebarOpen} 
          onMenuClick={() => setSidebarOpen(!isSidebarOpen)} 
        />
        <div className="app-content">
          <Outlet />
        </div>
      </div>

      {/* 4. Oculta el BottomNav si el menú lateral está abierto */}
      {!isSidebarOpen && <BottomNav />}
    </div>
  );
}

export default App;