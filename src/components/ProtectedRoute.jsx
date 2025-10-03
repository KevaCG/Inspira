// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';

const ProtectedRoute = ({ children }) => {
    // Este hook de una librería auxiliar nos dice si hay un usuario y si está cargando
    const [user, loading] = useAuthState(auth);

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (!user) {
        return <Navigate to="/" />;
    }

    return children;
};

export default ProtectedRoute;