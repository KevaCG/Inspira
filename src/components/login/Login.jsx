// src/components/login/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// 1. Importa los nuevos proveedores y funciones
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from '../../firebase';

import { FcGoogle } from 'react-icons/fc';
import { FaApple, FaFacebook } from 'react-icons/fa';
import Input from '../input/Input';
import Button from '../buttonLogin/Button';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailSignIn = async (event) => {
    event.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/home');
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      alert("Correo o contraseña incorrectos.");
    }
  };

  // --- 2. NUEVA FUNCIÓN PARA EL INICIO DE SESIÓN CON GOOGLE ---
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Revisa si el usuario ya existe en Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      // Si el usuario no existe, crea su documento
      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          name: user.displayName,
          email: user.email,
        });
      }
      
      navigate('/home'); // Redirige al home
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Bienvenido a <strong>Inspira</strong></h1>
        <p className="subtitle">Inicia sesión para continuar</p>

        <form onSubmit={handleEmailSignIn}>
            <Input
                label="Correo Electrónico" type="email" name="email"
                value={email} onChange={(e) => setEmail(e.target.value)}
            />
            <Input
                label="Contraseña" type="password" name="password"
                value={password} onChange={(e) => setPassword(e.target.value)}
            />
            <div className="button-wrapper">
                <Button type="submit">Iniciar Sesión</Button>
            </div>
        </form>

        <a href="#" className="forgot-password">¿Olvidaste tu contraseña?</a>
        <div className="divider"></div>

        <div className="social-login">
            <button className="social-button" onClick={handleGoogleSignIn}>
                <FcGoogle size={20} />
            </button>
        </div>

        <p className="signup-link">
          ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;