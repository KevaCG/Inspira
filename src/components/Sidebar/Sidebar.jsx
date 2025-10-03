import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import './Sidebar.css';
import {
    IoBulbOutline,
    IoChatbubbleEllipsesOutline,
    IoBookOutline,
    IoTrophyOutline,
    IoHandLeftOutline,
    IoClose,
    IoPersonOutline
} from 'react-icons/io5';
import LogoutButton from '../LogoutButton/LogoutButton'; 

const navItems = [
    { to: "/home", icon: <IoBulbOutline size={24} />, label: "Retos", color: "purple" },
    { to: "/community", icon: <IoHandLeftOutline size={24} />, label: "Comunidad", color: "blue" },
    { to: "/journal", icon: <IoBookOutline size={24} />, label: "Diario", color: "green" },
    { to: "/progress", icon: <IoTrophyOutline size={24} />, label: "Progreso", color: "yellow" },
    { to: "/chat", icon: <IoChatbubbleEllipsesOutline size={24} />, label: "Chat", color: "pink" },
];

const Sidebar = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/'); 
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };

    return (
        <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
                <h3>Inspira</h3>
                <button onClick={onClose} className="close-button">
                    <IoClose size={28} />
                </button>
            </div>

            <nav className="sidebar-nav">
                <ul>
                    {navItems.map(item => (
                        <li key={item.to}>
                            <NavLink to={item.to} className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''} color-${item.color}`}>
                                <div className="icon-container">{item.icon}</div>
                                <span className="label">{item.label}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="sidebar-footer">
                <NavLink to="/profile" className={({ isActive }) => `sidebar-item profile-link ${isActive ? 'active' : ''}`}>
                    <div className="icon-container">
                        <IoPersonOutline size={24} />
                    </div>
                    <span className="label">Perfil</span>
                </NavLink>
                <LogoutButton onClick={handleLogout} />
            </div>
        </aside>
    );
};

export default Sidebar;