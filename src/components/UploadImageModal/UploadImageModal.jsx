// src/components/UploadImageModal.jsx

import React, { useState, useEffect } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { storage, db } from '../../firebase'; // Asegúrate de que la ruta a firebase.js sea correcta
import './UploadImageModal.css';

// Importa tu componente personalizado para seleccionar archivos
import FileInput from '../FileInput/FileInput';

const UploadImageModal = ({ challengeId, user, userName, onClose }) => {
    const [file, setFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState('');
    
    // 1. Nuevo estado para la URL de previsualización
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type.startsWith('image/')) {
            setFile(selectedFile);
            setError('');
            // 2. Crea una URL local para la vista previa de la imagen seleccionada
            setPreviewUrl(URL.createObjectURL(selectedFile));
        } else {
            setFile(null);
            setPreviewUrl(null);
            setError('Por favor, selecciona un archivo de imagen válido.');
        }
    };

    // 3. Limpia la URL de previsualización para evitar fugas de memoria
    useEffect(() => {
        // Esta es una función de limpieza que se ejecuta cuando el componente se desmonta
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleUpload = () => {
        if (!file) return;

        const fileName = `${new Date().getTime()}-${file.name}`;
        const storageRef = ref(storage, `diaryImages/${fileName}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress(progress);
            },
            (error) => {
                console.error("Error al subir:", error);
                setError('Ocurrió un error al subir la imagen.');
            },
            async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

                await addDoc(collection(db, 'creativeDiaryEntries'), {
                    challengeId: challengeId,
                    imageUrl: downloadURL,
                    uploaderId: user.uid,
                    uploaderName: userName,
                    createdAt: serverTimestamp(),
                });

                onClose(); // Cierra el modal después de subir
            }
        );
    };
    
    // Función para limpiar la selección y volver a mostrar el input de archivo
    const clearSelection = () => {
        setFile(null);
        setPreviewUrl(null);
        setError('');
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Sube tu imagen creativa</h2>
                
                {/* --- 4. Renderizado Condicional --- */}
                {!previewUrl ? (
                    // Si no hay archivo seleccionado, muestra el input para elegir uno
                    <FileInput onChange={handleFileChange}>
                        Elige un archivo
                    </FileInput>
                ) : (
                    // Si hay un archivo, muestra la vista previa
                    <div className="image-preview-container">
                        <img src={previewUrl} alt="Vista previa" className="image-preview" />
                        <button onClick={clearSelection} className="change-image-button">
                            Cambiar imagen
                        </button>
                    </div>
                )}

                {error && <p className="error-text">{error}</p>}
                {uploadProgress > 0 && <progress value={uploadProgress} max="100" />}
                
                <button className="upload-button" onClick={handleUpload} disabled={!file || uploadProgress > 0}>
                    {uploadProgress > 0 ? `Subiendo ${Math.round(uploadProgress)}%` : 'Subir Imagen'}
                </button>
            </div>
        </div>
    );
};

export default UploadImageModal;