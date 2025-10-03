// src/components/community/CommunityMural.jsx
import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, getDoc, doc, limit } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import './CommunityMural.css';

const noteColors = ['yellow', 'pink', 'blue', 'green'];

const CommunityMural = () => {
    const [user] = useAuthState(auth);
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState('');
    const [userName, setUserName] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Obtener el nombre del usuario actual una vez
    useEffect(() => {
        const fetchUserName = async () => {
            if (user) {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                    setUserName(userDoc.data().name);
                }
            }
        };
        fetchUserName();
    }, [user]);

    // Efecto para escuchar las notas del mural en tiempo real
    useEffect(() => {
        const q = query(
            collection(db, 'communityMural'), 
            orderBy('createdAt', 'desc'),
            limit(50) // Traemos solo las últimas 50 notas para no sobrecargar
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const notesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setNotes(notesData);
            setIsLoading(false);
        });

        return () => unsubscribe(); // Limpia el listener al salir
    }, []);

    // Función para enviar una nueva nota
    const handleSubmitNote = async (e) => {
        e.preventDefault();
        if (newNote.trim() === '' || !user) return;

        const randomColor = noteColors[Math.floor(Math.random() * noteColors.length)];

        await addDoc(collection(db, 'communityMural'), {
            text: newNote,
            authorName: userName || 'Anónimo',
            authorId: user.uid,
            color: randomColor,
            createdAt: serverTimestamp(),
        });

        setNewNote('');
    };

    return (
        <div className="mural-container">
            <header className="mural-header">
                <h2>Mural Comunitario</h2>
                <p>Comparte una idea, una reflexión o un pensamiento positivo.</p>
            </header>

            <form onSubmit={handleSubmitNote} className="note-form">
                <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Escribe tu aporte aquí..."
                    maxLength="200"
                />
                <button type="submit" disabled={!newNote.trim()}>Publicar</button>
            </form>

            <div className="mural-grid">
                {isLoading ? <p>Cargando notas...</p> : notes.map(note => (
                    <div key={note.id} className={`mural-note note-${note.color}`}>
                        <p className="note-text">{note.text}</p>
                        <span className="note-author">- {note.authorName}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CommunityMural;