// src/components/journal/Journal.jsx
import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import './Journal.css';

const Journal = () => {
    const [user] = useAuthState(auth);
    const [entries, setEntries] = useState([]);
    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Efecto para cargar las entradas del diario del usuario
    useEffect(() => {
        if (!user) return;

        const entriesCollectionRef = collection(db, 'users', user.uid, 'journalEntries');
        const q = query(entriesCollectionRef, orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const entriesData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                // Convierte el timestamp de Firebase a una fecha legible
                createdAt: doc.data().createdAt?.toDate().toLocaleDateString('es-ES')
            }));
            setEntries(entriesData);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    // Función para guardar una nueva entrada
    const handleSaveEntry = async (e) => {
        e.preventDefault();
        if (newContent.trim() === '' || !user) return;

        const entriesCollectionRef = collection(db, 'users', user.uid, 'journalEntries');
        await addDoc(entriesCollectionRef, {
            title: newTitle || 'Reflexión sin título',
            content: newContent,
            createdAt: serverTimestamp(),
        });

        setNewTitle('');
        setNewContent('');
    };

    return (
        <div className="journal-container">
            <header className="journal-header">
                <h2>Mi Diario Personal</h2>
                <p>Un espacio privado para tus pensamientos y reflexiones.</p>
            </header>

            <form onSubmit={handleSaveEntry} className="journal-form">
                <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Título (opcional)"
                    className="journal-input"
                />
                <textarea
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Escribe aquí tu reflexión del día..."
                    className="journal-textarea"
                    required
                />
                <button type="submit" disabled={!newContent.trim()}>Guardar Entrada</button>
            </form>

            <hr className="journal-divider" />

            <div className="past-entries">
                <h3>Entradas Anteriores</h3>
                {isLoading ? (
                    <p>Cargando tus entradas...</p>
                ) : entries.length > 0 ? (
                    <div className="entry-list">
                        {entries.map(entry => (
                            <div key={entry.id} className="journal-entry">
                                <h4>{entry.title}</h4>
                                <p>{entry.content}</p>
                                <span>{entry.createdAt}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>Aún no has escrito ninguna entrada en tu diario. ¡Anímate a empezar!</p>
                )}
            </div>
        </div>
    );
};

export default Journal;