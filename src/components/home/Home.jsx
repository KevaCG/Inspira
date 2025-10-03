import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc, updateDoc, collection, getDocs, addDoc, serverTimestamp, query, where } from "firebase/firestore";
import { auth, db } from '../../firebase';
import './Home.css';
import { IoHomeOutline, IoPersonCircleOutline, IoBulbOutline, IoChatbubbleEllipsesOutline, IoBookOutline, IoTrophyOutline, IoHandLeftOutline } from 'react-icons/io5';

import Input from '../input/Input';
import Button from '../buttonLogin/Button';
import CommentsModal from './CommentsModal';
import ImageCarouselModal from '../ImageCarouselModal/ImageCarouselModal';
import UploadImageModal from '../UploadImageModal/UploadImageModal';

const Home = () => {
    const [user, loading] = useAuthState(auth);
    const [userName, setUserName] = useState("...");
    const [dailyChallenge, setDailyChallenge] = useState(null);
    const [newComment, setNewComment] = useState("");
    const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
    const [challengeImages, setChallengeImages] = useState([]);
    const [randomImage, setRandomImage] = useState(null);
    const [isCarouselOpen, setIsCarouselOpen] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    // Efecto para buscar datos del usuario y el reto del día
    useEffect(() => {
        const fetchUserDataAndChallenge = async () => {
            if (!user) return;
            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                const userData = userDoc.data();
                setUserName(userData.name);
                const today = new Date().toDateString();
                if (userData.challengeDate === today && userData.challengeId) {
                    const challengeDocRef = doc(db, "challenges", userData.challengeId);
                    const challengeDoc = await getDoc(challengeDocRef);
                    if (challengeDoc.exists()) {
                        setDailyChallenge({ id: challengeDoc.id, ...challengeDoc.data() });
                    }
                } else {
                    const challengesCollectionRef = collection(db, "challenges");
                    const challengesSnapshot = await getDocs(challengesCollectionRef);
                    const challengesList = challengesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    if (challengesList.length > 0) {
                        const randomChallenge = challengesList[Math.floor(Math.random() * challengesList.length)];
                        await updateDoc(userDocRef, {
                            challengeId: randomChallenge.id,
                            challengeDate: today
                        });
                        setDailyChallenge(randomChallenge);
                    }
                }
            }
        };
        if (!loading) {
            fetchUserDataAndChallenge();
        }
    }, [user, loading]);

    // Efecto para buscar las imágenes del reto actual
    useEffect(() => {
        const fetchChallengeImages = async () => {
            if (!dailyChallenge) return;
            const q = query(collection(db, "creativeDiaryEntries"), where("challengeId", "==", dailyChallenge.id));
            const imageSnapshot = await getDocs(q);

            if (!imageSnapshot.empty) {
                const images = imageSnapshot.docs.map(doc => doc.data());
                setChallengeImages(images);
                const randomIndex = Math.floor(Math.random() * images.length);
                setRandomImage(images[randomIndex]);
            } else {
                setChallengeImages([]);
                setRandomImage(null);
            }
        };
        fetchChallengeImages();
    }, [dailyChallenge]);

    // Función para enviar un comentario
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (newComment.trim() === "" || !dailyChallenge) return;
        try {
            await addDoc(collection(db, "challenges", dailyChallenge.id, "comments"), {
                text: newComment,
                authorName: userName,
                authorId: user.uid,
                createdAt: serverTimestamp()
            });
            setNewComment("");
            alert("¡Reflexión enviada!");
        } catch (error) {
            console.error("Error al añadir el comentario:", error);
        }
    };

    // Función para manejar el clic en la tarjeta del diario
    const handleDiaryClick = () => {
        if (challengeImages.length > 0) {
            setIsCarouselOpen(true);
        } else {
            setIsUploadModalOpen(true);
        }
    };

    if (loading) {
        return <div className="greeting">Cargando...</div>;
    }

    return (
        <>
            <div className="home-container">
                <main className="home-content">
                    <h1 className="greeting">Hola, {userName}</h1>

                    <section className="challenge-card">
                        {dailyChallenge ? (
                            <>
                                <p className="challenge-subtitle">Reto de hoy</p>
                                <h2>{dailyChallenge.title}</h2>
                                <p className="challenge-objective"><strong>Objetivo:</strong> {dailyChallenge.objective}</p>
                                <div className="challenge-task">
                                    <p><strong>Tarea:</strong></p>
                                    <ul>
                                        {dailyChallenge.tasks.map((task, index) => (<li key={index}>{task}</li>))}
                                    </ul>
                                </div>
                            </>
                        ) : (<p>Cargando tu reto del día...</p>)}
                    </section>

                    <hr className="divider-line" />

                    {dailyChallenge && (
                        <section className="add-comment-section">
                            <form onSubmit={handleCommentSubmit} className="comment-form-inline">
                                <Input label="Deja tu comentario aquí" type="text" name="comment" value={newComment} onChange={(e) => setNewComment(e.target.value)} />
                                <Button type="submit">Enviar</Button>
                            </form>
                            <button className="view-comments-button" onClick={() => setIsCommentsModalOpen(true)}>Ver comentarios</button>
                        </section>
                    )}

                    <section className="diary-card-container" onClick={handleDiaryClick}>
                        <div className="diary-card-bg"></div>
                        <div className="diary-card-fg">
                            {randomImage ? (
                                <img src={randomImage.imageUrl} alt="Entrada de diario aleatoria" className="diary-image-preview" />
                            ) : (
                                <h2>Diario Creativo</h2>
                            )}
                        </div>
                    </section>
                </main>
            </div>

            {isCommentsModalOpen && (
                <CommentsModal
                    challengeId={dailyChallenge?.id}
                    onClose={() => setIsCommentsModalOpen(false)}
                />
            )}

            {isCarouselOpen && (
                <ImageCarouselModal
                    images={challengeImages}
                    initialIndex={challengeImages.findIndex(img => img.imageUrl === randomImage.imageUrl)}
                    onClose={() => setIsCarouselOpen(false)}
                    onUploadClick={() => {
                        setIsCarouselOpen(false);
                        setIsUploadModalOpen(true);
                    }}
                />
            )}

            {isUploadModalOpen && dailyChallenge && (
                <UploadImageModal
                    challengeId={dailyChallenge.id}
                    user={user}
                    userName={userName}
                    onClose={() => setIsUploadModalOpen(false)}
                />
            )}
        </>
    );
};

export default Home;