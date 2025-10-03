import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, onSnapshot, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../../firebase';
import './ChatList.css';
import { IoSearch } from 'react-icons/io5';

const ChatList = () => {
    const [user] = useAuthState(auth);
    const [chats, setChats] = useState([]);
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    // Efecto para obtener los chats existentes del usuario en tiempo real
    useEffect(() => {
        if (!user) return;

        const q = query(collection(db, "chats"), where("participants", "array-contains", user.uid));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const chatsData = querySnapshot.docs.map(doc => {
                const data = doc.data();
                const otherParticipantUid = data.participants.find(uid => uid !== user.uid);
                const otherUserInfo = data.participantInfo ? data.participantInfo[otherParticipantUid] : null;

                return {
                    id: doc.id,
                    ...data,
                    otherUserName: otherUserInfo?.name || 'Usuario desconocido',
                    otherUserAvatar: otherUserInfo?.name || '?'
                };
            });
            setChats(chatsData);
        });

        return () => unsubscribe();
    }, [user]);

    // Efecto para buscar usuarios mientras se escribe en la barra de búsqueda
    useEffect(() => {
        const searchUsers = async () => {
            const term = searchTerm.trim();
            if (term === '') {
                setSearchResults([]);
                return;
            }
            const usersQuery = query(
                collection(db, "users"),
                where("name", ">=", term),
                where("name", "<=", term + '\uf8ff')
            );
            const querySnapshot = await getDocs(usersQuery);
            const users = querySnapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .filter(foundUser => foundUser.id !== user.uid);
            setSearchResults(users);
        };

        const debounceTimer = setTimeout(() => {
            searchUsers();
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [searchTerm, user]);

    // Función para manejar la selección de un usuario en los resultados de búsqueda
    const handleSelectUser = async (selectedUser) => {
        if (!user) return;

        const chatsRef = collection(db, "chats");
        const q = query(chatsRef, where("participants", "array-contains", user.uid));
        const querySnapshot = await getDocs(q);
        const existingChat = querySnapshot.docs.find(doc => 
            doc.data().participants.includes(selectedUser.id)
        );

        if (existingChat) {
            navigate(`/chat/${existingChat.id}`);
        } else {
            // Lógica para crear un chat nuevo con un mensaje inicial
            const currentUserData = (await getDoc(doc(db, "users", user.uid))).data();
            const initialMessage = `¡Hola! He iniciado una conversación contigo.`;

            const newChatDocRef = await addDoc(chatsRef, {
                participants: [user.uid, selectedUser.id],
                participantInfo: {
                    [user.uid]: { name: currentUserData.name },
                    [selectedUser.id]: { name: selectedUser.name }
                },
                lastMessage: {
                    text: initialMessage,
                    createdAt: serverTimestamp()
                },
                createdAt: serverTimestamp()
            });

            await addDoc(collection(db, "chats", newChatDocRef.id, "messages"), {
                text: initialMessage,
                senderId: user.uid,
                createdAt: serverTimestamp(),
            });

            navigate(`/chat/${newChatDocRef.id}`);
        }
    };

    // Función para decidir qué contenido renderizar
    const renderContent = () => {
        if (searchTerm.trim() !== '') {
            return (
                <div className="search-results">
                    {searchResults.length > 0 ? (
                        searchResults.map(foundUser => (
                            <div key={foundUser.id} className="search-result-item" onClick={() => handleSelectUser(foundUser)}>
                                <div className="chat-avatar">
                                    <img src={`https://ui-avatars.com/api/?name=${foundUser.name}&background=004d40&color=fff`} alt={foundUser.name} />
                                </div>
                                <span className="chat-name">{foundUser.name}</span>
                            </div>
                        ))
                    ) : (
                        <p className="no-results-message">No se encontraron usuarios.</p>
                    )}
                </div>
            );
        }

        if (chats.length > 0) {
            return chats.map(chat => (
                <Link to={`/chat/${chat.id}`} key={chat.id} className="chat-item">
                    <div className="chat-avatar">
                        <img src={`https://ui-avatars.com/api/?name=${chat.otherUserAvatar}&background=004d40&color=fff`} alt={chat.otherUserName} />
                    </div>
                    <div className="chat-info">
                        <span className="chat-name">{chat.otherUserName}</span>
                        <span className="chat-last-message">{chat.lastMessage?.text || 'Inicia la conversación'}</span>
                    </div>
                </Link>
            ));
        }

        return <p className="no-results-message">Usa la barra de búsqueda para encontrar a alguien y empezar a chatear.</p>;
    };

    return (
        <div className="chat-list-container">
            <div className="search-bar-wrapper">
                <IoSearch size={20} className="search-icon" />
                <input
                    type="text"
                    placeholder="Buscar usuarios para chatear..."
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="chat-items-wrapper">
                {renderContent()}
            </div>
        </div>
    );
};

export default ChatList;