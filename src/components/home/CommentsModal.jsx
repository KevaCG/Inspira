// src/components/CommentsModal.jsx
import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import './CommentsModal.css'; // Crearemos este archivo de estilos
import { IoClose } from "react-icons/io5";

const CommentsModal = ({ challengeId, onClose }) => {
    const [comments, setComments] = useState([]);

    // Efecto para cargar los comentarios del reto específico en tiempo real
    useEffect(() => {
        if (!challengeId) return;

        const commentsQuery = query(
            collection(db, "challenges", challengeId, "comments"),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(commentsQuery, (querySnapshot) => {
            const commentsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setComments(commentsData);
        });

        return () => unsubscribe();
    }, [challengeId]);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-button" onClick={onClose}>
                    <IoClose size={24} />
                </button>
                <h2>Reflexiones de la comunidad</h2>
                <div className="comments-list">
                    {comments.length > 0 ? (
                        comments.map(comment => (
                            <div key={comment.id} className="comment-item">
                                <p><strong>{comment.authorName}:</strong> {comment.text}</p>
                            </div>
                        ))
                    ) : (
                        <p>Aún no hay reflexiones. ¡Sé el primero!</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CommentsModal;