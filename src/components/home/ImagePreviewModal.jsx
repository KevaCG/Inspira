import React from 'react';
import './ImagePreviewModal.css';

const ImagePreviewModal = ({ imageUrl, onClose, onUploadClick }) => {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content preview-modal" onClick={(e) => e.stopPropagation()}>
                <img src={imageUrl} alt="Diario Creativo" className="preview-image" />
                <button onClick={onUploadClick} className="upload-prompt-button">
                    Sube tu propia imagen
                </button>
            </div>
        </div>
    );
};

export default ImagePreviewModal;