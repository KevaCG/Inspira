// src/components/profile/EditProfileModal.jsx

import React, { useState } from 'react';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import './EditProfileModal.css';
import Input from '../input/Input';
import { IoClose } from 'react-icons/io5';

const EditProfileModal = ({ user, currentData, onClose, onUpdate }) => {
    // 1. Eliminamos el estado para el email
    const [name, setName] = useState(currentData.name);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Si el nombre no ha cambiado, no hacemos nada
        if (name === currentData.name) {
            setIsLoading(false);
            onClose();
            return;
        }

        try {
            // Actualiza el nombre en Firestore (para nuestra app)
            const userDocRef = doc(db, "users", user.uid);
            await updateDoc(userDocRef, { name: name });

            // Actualiza el nombre en Firebase Auth (para el perfil general de Firebase)
            await updateProfile(auth.currentUser, { displayName: name });
            
            onUpdate(); // Refresca los datos en la página de perfil
            onClose();  // Cierra el modal
        } catch (error) {
            console.error("Error al actualizar el perfil:", error);
            setError(`Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-button" onClick={onClose}><IoClose size={24} /></button>
                <h2>Editar Nombre</h2>
                <form onSubmit={handleUpdate}>
                    <Input
                        label="Nombre Completo"
                        type="text"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    
                    {/* 2. Eliminamos el input del correo electrónico */}

                    {error && <p className="error-text">{error}</p>}
                    <button type="submit" className="update-button" disabled={isLoading}>
                        {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditProfileModal;