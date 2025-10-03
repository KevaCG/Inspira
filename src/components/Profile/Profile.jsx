import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase'; // Asegúrate de que la ruta a tu archivo firebase.js sea correcta
import './Profile.css';

// Importa los iconos que necesitas
import {
    FaPencilAlt,
    FaUserEdit,
    FaLock,
    FaQuestionCircle,
    FaCog
} from 'react-icons/fa';
import { IoChevronForward, IoExitOutline } from 'react-icons/io5';

// Importa el modal para editar el perfil
import EditProfileModal from './EditProfileModal';

const Profile = () => {
    const [user, loading] = useAuthState(auth);
    const [userData, setUserData] = useState({ name: "...", email: "Cargando..." });
    const navigate = useNavigate();

    // Estado para controlar la visibilidad del modal de edición
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Se usa useCallback para evitar que la función se recree en cada renderizado,
    // lo que optimiza el rendimiento del useEffect.
    const fetchUserData = useCallback(async () => {
        if (user) {
            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                setUserData(userDoc.data());
            }
        }
    }, [user]);

    // Efecto para buscar los datos del usuario cuando el componente se carga
    useEffect(() => {
        if (!loading) {
            fetchUserData();
        }
    }, [user, loading, fetchUserData]);

    // Función para manejar el cierre de sesión
    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/'); // Redirige al login
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };

    return (
        // Usamos un fragmento <> para poder renderizar el modal al mismo nivel que el contenedor principal
        <>
            <div className="profile-container">
                <div className="profile-header">
                    <div className="profile-picture">
                        <img src={`https://ui-avatars.com/api/?name=${userData.name}&background=004d40&color=fff&size=128`} alt="Avatar" />
                    </div>
                    <h1>{userData.name}</h1>
                    <p>{userData.email}</p>
                </div>

                <ul className="profile-menu">
                    {/* Este elemento abre el modal al hacer clic */}
                    <li className="profile-menu-item" onClick={() => setIsEditModalOpen(true)}>
                        <div className="menu-item-content">
                            <span className="menu-item-icon"><FaUserEdit /></span>
                            <span className="menu-item-text">Editar Perfil</span>
                        </div>
                        <IoChevronForward className="menu-item-arrow" />
                    </li>
                    <MenuItem icon={<FaLock />} text="Cambiar Contraseña" to="/profile/password" />
                    <MenuItem icon={<FaQuestionCircle />} text="Ayuda y Soporte" to="/help" />
                    <MenuItem icon={<FaCog />} text="Preferencias" to="/settings" />
                    <li className="profile-menu-item" onClick={handleLogout}>
                        <div className="menu-item-content">
                            <span className="menu-item-icon logout-icon"><IoExitOutline /></span>
                            <span className="menu-item-text">Cerrar Sesión</span>
                        </div>
                        <IoChevronForward className="menu-item-arrow" />
                    </li>
                </ul>
            </div>
            
            {/* Renderizado condicional del modal de edición */}
            {isEditModalOpen && (
                <EditProfileModal
                    user={user}
                    currentData={userData}
                    onClose={() => setIsEditModalOpen(false)}
                    onUpdate={fetchUserData} // Pasamos la función para que el modal pueda refrescar los datos
                />
            )}
        </>
    );
};

// Componente auxiliar para los elementos del menú que son enlaces
const MenuItem = ({ icon, text, to }) => (
    <li className="profile-menu-item">
        <Link to={to} className="menu-item-content">
            <span className="menu-item-icon">{icon}</span>
            <span className="menu-item-text">{text}</span>
        </Link>
        <IoChevronForward className="menu-item-arrow" />
    </li>
);

export default Profile;