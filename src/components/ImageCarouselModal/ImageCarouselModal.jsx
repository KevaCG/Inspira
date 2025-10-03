// src/components/ImageCarouselModal.jsx
import React, { useState } from 'react';
import './ImageCarouselModal.css';
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

const ImageCarouselModal = ({ images, initialIndex, onClose, onUploadClick }) => {
    // 1. Estado para saber qué imagen del array estamos viendo
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    if (!images || images.length === 0) {
        return null; // No renderizar nada si no hay imágenes
    }

    // 2. Funciones para navegar entre imágenes
    const goToPrevious = () => {
        const isFirstImage = currentIndex === 0;
        const newIndex = isFirstImage ? images.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToNext = () => {
        const isLastImage = currentIndex === images.length - 1;
        const newIndex = isLastImage ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    const currentImage = images[currentIndex];

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content preview-modal" onClick={(e) => e.stopPropagation()}>

                {/* Botones de navegación del carrusel */}
                <button className="carousel-nav-button left" onClick={goToPrevious}><IoChevronBack size={30} /></button>
                <button className="carousel-nav-button right" onClick={goToNext}><IoChevronForward size={30} /></button>

                <img src={currentImage.imageUrl} alt="Diario Creativo" className="preview-image" />

                {/* Información de quién subió la imagen */}
                <div className="uploader-info">
                    <p>Subido por: <strong>{currentImage.uploaderName}</strong></p>
                </div>

                <button onClick={onUploadClick} className="upload-prompt-button">
                    Sube tu propia imagen
                </button>
            </div>
        </div>
    );
};

export default ImageCarouselModal;