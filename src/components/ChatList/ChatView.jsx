import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, doc, onSnapshot, addDoc, serverTimestamp, query, orderBy, updateDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../../firebase';
import './ChatView.css';
import { IoChevronBack, IoSend, IoVideocam, IoCall, IoEllipsisVertical } from 'react-icons/io5';

// Importa tu componente de Input personalizado
import Input from '../input/Input';

const ChatView = () => {
    const [user] = useAuthState(auth);
    const { chatId } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [chatInfo, setChatInfo] = useState(null);
    const messagesEndRef = useRef(null);

    // Efecto para cargar la información del chat y escuchar los mensajes
    useEffect(() => {
        if (!user || !chatId) return;

        const chatDocRef = doc(db, "chats", chatId);
        const unsubscribeChatInfo = onSnapshot(chatDocRef, (doc) => {
            if (doc.exists()) {
                const chatData = doc.data();
                const otherParticipantUid = chatData.participants.find(uid => uid !== user.uid);
                const otherUserInfo = chatData.participantInfo ? chatData.participantInfo[otherParticipantUid] : null;
                setChatInfo({
                    ...chatData,
                    otherUserName: otherUserInfo?.name || 'Usuario',
                    otherUserAvatar: otherUserInfo?.name || '?'
                });
            }
        });

        const messagesQuery = query(
            collection(db, "chats", chatId, "messages"),
            orderBy("createdAt", "asc")
        );
        const unsubscribeMessages = onSnapshot(messagesQuery, (querySnapshot) => {
            const msgs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setMessages(msgs);
        });

        return () => {
            unsubscribeChatInfo();
            unsubscribeMessages();
        };
    }, [chatId, user]);
    
    // Efecto para hacer scroll al último mensaje
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Función para enviar un nuevo mensaje
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (newMessage.trim() === "" || !user) return;

        try {
            await addDoc(collection(db, "chats", chatId, "messages"), {
                text: newMessage,
                senderId: user.uid,
                createdAt: serverTimestamp(),
            });

            const chatDocRef = doc(db, "chats", chatId);
            await updateDoc(chatDocRef, {
                lastMessage: {
                    text: newMessage,
                    createdAt: serverTimestamp()
                }
            });

            setNewMessage("");
        } catch (error) {
            console.error("Error al enviar mensaje:", error);
        }
    };

    if (!chatInfo) {
        return <div className="chat-view-container"><p>Cargando chat...</p></div>;
    }

    return (
        <div className="chat-view-container">
            <header className="chat-view-header">
                <Link to="/chat" className="back-button"><IoChevronBack size={24} /></Link>
                <div className="contact-avatar">
                    <img src={`https://ui-avatars.com/api/?name=${chatInfo.otherUserAvatar}&background=e0e0e0&color=333`} alt={chatInfo.otherUserName} />
                </div>
                <div className="contact-info">
                    <span className="contact-name">{chatInfo.otherUserName}</span>
                    <span className="contact-status">En línea</span>
                </div>
            </header>

            <main className="chat-messages">
                {messages.map(msg => (
                    <div key={msg.id} className={`message-bubble-wrapper ${msg.senderId === user.uid ? 'sent' : 'received'}`}>
                        <div className="message-bubble">
                            {msg.text}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </main>

            <footer className="chat-input-area">
                <form className="chat-form" onSubmit={handleSendMessage}>
                    <Input
                        label="Escribe un mensaje..."
                        type="text"
                        name="message"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button type="submit" className="send-button">
                        <IoSend size={22} />
                    </button>
                </form>
            </footer>
        </div>
    );
};

export default ChatView;