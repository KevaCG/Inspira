// src/components/progress/Progress.jsx
import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
// --- 1. AÑADE 'collection' A ESTA LÍNEA ---
import { collectionGroup, query, where, getDocs, doc, getDoc, collection } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import './Progress.css';
import { FaComment, FaImage } from 'react-icons/fa';

const Progress = () => {
    const [user, loadingUser] = useAuthState(auth);
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            if (!user) return;

            // Buscar todos los comentarios del usuario
            const commentsQuery = query(collectionGroup(db, 'comments'), where('authorId', '==', user.uid));
            const userCommentsSnap = await getDocs(commentsQuery);

            // 2. Buscar todas las imágenes del usuario (esta línea ahora funcionará)
            const imagesQuery = query(collection(db, 'creativeDiaryEntries'), where('uploaderId', '==', user.uid));
            const userImagesSnap = await getDocs(imagesQuery);

            // Agrupar contribuciones por el ID del reto
            const contributions = new Map();

            userCommentsSnap.forEach(commentDoc => {
                const data = commentDoc.data();
                const challengeId = commentDoc.ref.parent.parent.id;
                if (!contributions.has(challengeId)) {
                    contributions.set(challengeId, {});
                }
                contributions.get(challengeId).comment = data.text;
            });

            userImagesSnap.forEach(imageDoc => {
                const data = imageDoc.data();
                const challengeId = data.challengeId;
                if (!contributions.has(challengeId)) {
                    contributions.set(challengeId, {});
                }
                contributions.get(challengeId).imageUrl = data.imageUrl;
            });
            
            // Buscar los detalles de cada reto y construir el historial final
            const historyPromises = Array.from(contributions.keys()).map(async (challengeId) => {
                const challengeDoc = await getDoc(doc(db, 'challenges', challengeId));
                return {
                    id: challengeId,
                    challengeTitle: challengeDoc.exists() ? challengeDoc.data().title : 'Reto desconocido',
                    ...contributions.get(challengeId),
                };
            });

            const resolvedHistory = await Promise.all(historyPromises);
            // Ordena el historial, por ejemplo, por título de reto (opcional)
            resolvedHistory.sort((a, b) => a.challengeTitle.localeCompare(b.challengeTitle));

            setHistory(resolvedHistory);
            setIsLoading(false);
        };

        if (!loadingUser) {
            fetchHistory();
        }

    }, [user, loadingUser]);

    if (isLoading) {
        return <div className="progress-container"><p>Cargando tu progreso...</p></div>;
    }

    return (
        <div className="progress-container">
            <h2>Mi Historial de Retos</h2>
            {history.length > 0 ? (
                <div className="history-list">
                    {history.map(item => (
                        <div key={item.id} className="history-item">
                            <h3>{item.challengeTitle}</h3>
                            {item.comment && (
                                <div className="contribution-item">
                                    <FaComment className="contribution-icon" />
                                    <p className="contribution-text">"{item.comment}"</p>
                                </div>
                            )}
                            {item.imageUrl && (
                                <div className="contribution-item">
                                    <FaImage className="contribution-icon" />
                                    <img src={item.imageUrl} alt={`Mi contribución para ${item.challengeTitle}`} className="contribution-image" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <h3>Aún no has participado en ningún reto.</h3>
                    <p>¡Explora los retos diarios, comparte tus reflexiones y sube tus creaciones para ver tu progreso aquí!</p>
                </div>
            )}
        </div>
    );
};

export default Progress;