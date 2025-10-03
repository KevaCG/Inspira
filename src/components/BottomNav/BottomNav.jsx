// src/components/BottomNav.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './BottomNav.css';
import { IoHomeOutline, IoBulbOutline, IoChatbubbleEllipsesOutline, IoBookOutline, IoTrophyOutline, IoHandLeftOutline } from 'react-icons/io5';

const NavItem = ({ to, icon }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Link to={to} className={`nav-item ${isActive ? 'active' : ''}`}>
            {icon}
        </Link>
    );
};

const BottomNav = () => {
    return (
        <footer className="bottom-nav">
            <NavItem to="/home" icon={<IoBulbOutline size={28} />} label="Retos" />
            <NavItem to="/community" icon={<IoHandLeftOutline size={28} />} label="Comunidad" />
            <NavItem to="/journal" icon={<IoBookOutline size={28} />} label="Diario" />
            <NavItem to="/progress" icon={<IoTrophyOutline size={28} />} label="Progreso" />
            <NavItem to="/chat" icon={<IoChatbubbleEllipsesOutline size={28} />} label="Chat" />
        </footer>
    );
};

export default BottomNav;