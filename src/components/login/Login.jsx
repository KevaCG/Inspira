// src/components/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FaApple, FaFacebook, FaEnvelope, FaLock } from 'react-icons/fa';
import './Login.css';
import Input from '../input/Input';
import Button from '../buttonLogin/Button';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../firebase';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/home');
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            alert("Correo o contraseña incorrectos.");
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h1>
                    Bienvenido a <strong>Inspira</strong>
                </h1>
                <p className="subtitle">Inicia sesión para continuar</p>

                <form onSubmit={handleSubmit}>
                    <Input
                        label="Correo Electrónico"
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        icon={<FaEnvelope size={16} />}
                    />
                    <Input
                        label="Contraseña"
                        type="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        icon={<FaLock size={16} />}
                    />

                    <div className="button-wrapper">
                        <Button type="submit">Iniciar Sesion</Button>
                    </div>
                </form>

                <a href="#" className="forgot-password">
                    ¿Olvidaste tu contraseña?
                </a>
                <div className="divider"></div>
                <div className="social-login">
                    <button className="social-button"><FcGoogle size={20} /></button>
                    <button className="social-button"><FaApple size={20} color='#000' /></button>
                    <button className="social-button"><FaFacebook size={20} color="#1877F2" /></button>
                </div>
                <p className="signup-link">
                    ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;