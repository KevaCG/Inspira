// src/components/Input.jsx
import React, { useState } from 'react'; // 1. Importa useState
import styled from 'styled-components';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // 2. Importa los iconos de ojo

const Input = ({ label, type, name, value, onChange, icon }) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const inputType = isPasswordVisible ? 'text' : type;

    return (
        <StyledWrapper>
            <div className="inputGroup">
                {icon && <span className="inputIcon">{icon}</span>}
                <input
                    type={inputType}
                    name={name}
                    value={value}
                    onChange={onChange}
                    required
                    autoComplete="off"
                    className={icon ? 'with-icon' : ''}
                />
                <label htmlFor={name}>{label}</label>

                {type === 'password' && (
                    <span className="togglePasswordIcon" onClick={togglePasswordVisibility}>
                        {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                    </span>
                )}
            </div>
        </StyledWrapper>
    );
};

const StyledWrapper = styled.div`
input{
    color: #000;
}

.inputGroup {
    font-family: 'Poppins', 'Segoe UI', sans-serif;
    margin: 2em 0;
    width: 100%;
    position: relative;
    color: #000;
  }

  .inputIcon {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    color: #aaa;
  }

  .togglePasswordIcon {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: #aaa;
    cursor: pointer;
  }

  .inputGroup input {
    font-size: 100%;
    padding: 0.8em 0.5em; 
    outline: none;
    border: none;
    border-bottom: 2px solid rgb(200, 200, 200);
    border-radius: 0; 
    background-color: transparent;
    width: 100%;
    box-sizing: border-box;
    transition: border-color 0.3s ease;
  }
  .inputGroup input.with-icon {
    padding-left: 2em; 
  }
  .inputGroup label {
    font-size: 100%;
    position: absolute;
    left: 0; 
    top: 0.5em; 
    padding: 0 0.5em;
    pointer-events: none;
    transition: all 0.3s ease;
    color: rgb(100, 100, 100);
  }
  .inputGroup input.with-icon ~ label {
    left: 1.8em;
  }
  .inputGroup :is(input:focus, input:valid)~label {
    transform: translateY(-150%) scale(.9);
    margin: 0;
    padding: 0 0.4em;
    background-color: #fff;
  }
  .inputGroup :is(input:focus, input:valid) {
    border-bottom-color: #004d40;
  }
`;

export default Input;