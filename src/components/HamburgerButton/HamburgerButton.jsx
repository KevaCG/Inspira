import React from 'react';
import './HamburgerButton.css';

const HamburgerButton = ({ isOpen, onClick }) => {
    return (
        <button className={`hamburger-button ${isOpen ? 'active' : ''}`} onClick={onClick} aria-label="Toggle menu">
            <span className="line"></span>
            <span className="line"></span>
            <span className="line"></span>
        </button>
    );
};

export default HamburgerButton;