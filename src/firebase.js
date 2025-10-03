// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Importa getAuth
import { getFirestore } from "firebase/firestore"; // Importa getFirestore
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCf7yvJe7r0Hme0guwK-1vwX0DWQesgdIE",
  authDomain: "inspira-27ea2.firebaseapp.com",
  projectId: "inspira-27ea2",
  storageBucket: "inspira-27ea2.firebasestorage.app",
  messagingSenderId: "665415657251",
  appId: "1:665415657251:web:eb31a93a384187b1924e96",
  measurementId: "G-XGSGT2JMTJ",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
