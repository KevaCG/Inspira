// src/components/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaUser } from 'react-icons/fa';

import '../login/Login.css'; 
import Input from '../input/Input';
import Button from '../buttonLogin/Button';

import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from '../../firebase';

const Register = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden.');
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(db, "users", user.uid), {
                name: name,
                email: email,
            });

            console.log('Cuenta creada y datos guardados!');
            navigate('/home');

        } catch (error) {
            console.error("Error al crear la cuenta:", error);
            alert(`Error: ${error.message}`);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h1>
                    Crea una cuenta en <strong>Inspira</strong>
                </h1>
                <p className="subtitle">Regístrate para continuar</p>

                <form onSubmit={handleSubmit}>
                    <Input
                        label="Nombre Completo"
                        type="text"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        icon={<FaUser size={16} />}
                    />
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
                    <Input
                        label="Confirmar Contraseña"
                        type="password"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        icon={<FaLock size={16} />}
                    />

                    <div className="button-wrapper">
                        <Button type="submit">Registrarse</Button>
                    </div>
                </form>

                <div className="divider"></div>

                <p className="signup-link">
                    ¿Ya tienes una cuenta? <Link to="/">Inicia Sesión</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;