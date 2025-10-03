// src/components/Header/Header.jsx

import React, { useState, useEffect, useCallback } from 'react';
import HamburgerButton from '../HamburgerButton/HamburgerButton';
import './Header.css';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';

// 1. Importa el componente Link
import { Link } from 'react-router-dom';

const Header = ({ onMenuClick, isMenuOpen }) => {
    const [user, loading] = useAuthState(auth);
    const [userData, setUserData] = useState({ name: "...", email: "Cargando..." });

    const fetchUserData = useCallback(async () => {
        if (user) {
            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                setUserData(userDoc.data());
            }
        }
    }, [user]);

    useEffect(() => {
        if (!loading) {
            fetchUserData();
        }
    }, [user, loading, fetchUserData]);

    return (
        <header className="app-header">
            <HamburgerButton isOpen={isMenuOpen} onClick={onMenuClick} />
            
            {/* 2. Envuelve el div en un componente Link que apunta a "/profile" */}
            <Link to="/profile">
                <div className="profile-icon-wrapper">
                    <img src={`https://ui-avatars.com/api/?name=${userData.name}&background=004d40&color=fff&size=40`} alt="Avatar" />
                </div>
            </Link>
        </header>
    );
};

export default Header;