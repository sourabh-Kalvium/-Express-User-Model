import React, { useState, useEffect } from 'react';

const ImageUpload = ({ onUpload }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [error, setError] = useState('');

    const validateFile = (file) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!allowedTypes.includes(file.type)) {
            return 'Only image files (JPEG, PNG, WEBP, GIF) are allowed.';
        }

        if (file.size > maxSize) {
            return 'File size must be less than 5MB.';
        }

        return '';
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setError('');

        if (file) {
            const validationError = validateFile(file);
            if (validationError) {
                setError(validationError);
                setSelectedFile(null);
                setPreviewUrl(null);
                return;
            }

            setSelectedFile(file);
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
        }
    };

    useEffect(() => {
        // Cleanup function to revoke object URL and avoid memory leaks
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedFile || error) return;

        const formData = new FormData();
        formData.append('image', selectedFile);
        
        // Pass the FormData up to the parent component
        onUpload(formData);
    };

    return (
        <div style={styles.uploadContainer}>
            <p style={styles.label}>Post Image</p>
            
            <div style={styles.dropZone}>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={styles.fileInput}
                    id="imageInput"
                />
                <label htmlFor="imageInput" style={styles.inputLabel}>
                    {previewUrl ? 'Change Image' : 'Click to select an image'}
                </label>
            </div>

            {error && <p style={styles.errorText}>{error}</p>}

            {previewUrl && (
                <div style={styles.previewContainer}>
                    <img src={previewUrl} alt="Preview" style={styles.previewImage} />
                    <button 
                        type="button" 
                        style={styles.removeBtn}
                        onClick={() => {
                            setSelectedFile(null);
                            setPreviewUrl(null);
                        }}
                    >
                        Remove
                    </button>
                </div>
            )}

            <button
                onClick={handleSubmit}
                disabled={!selectedFile || !!error}
                style={{
                    ...styles.uploadBtn,
                    opacity: (!selectedFile || !!error) ? 0.6 : 1,
                    cursor: (!selectedFile || !!error) ? 'not-allowed' : 'pointer',
                }}
            >
                Confirm Image Selection
            </button>
        </div>
    );
};

const styles = {
    uploadContainer: {
        background: '#fcfcfc',
        border: '1px solid #eee',
        borderRadius: '10px',
        padding: '1.25rem',
        marginTop: '0.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    label: {
        margin: 0,
        fontWeight: '600',
        color: '#444',
        fontSize: '0.9rem',
    },
    dropZone: {
        border: '2px dashed #ddd',
        borderRadius: '8px',
        padding: '1.5rem',
        textAlign: 'center',
        position: 'relative',
        transition: 'border-color 0.2s',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80px',
    },
    fileInput: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        opacity: 0,
        cursor: 'pointer',
        top: 0,
        left: 0,
    },
    inputLabel: {
        color: '#007bff',
        fontWeight: '500',
        pointerEvents: 'none',
    },
    previewContainer: {
        position: 'relative',
        width: '100%',
        borderRadius: '8px',
        overflow: 'hidden',
        border: '1px solid #ddd',
        background: '#000',
        display: 'flex',
        justifyContent: 'center',
    },
    previewImage: {
        maxWidth: '100%',
        maxHeight: '300px',
        display: 'block',
    },
    removeBtn: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        background: 'rgba(220, 53, 69, 0.9)',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        padding: '4px 8px',
        fontSize: '0.75rem',
        cursor: 'pointer',
    },
    errorText: {
        color: '#dc3545',
        fontSize: '0.85rem',
        margin: 0,
        fontWeight: '500',
    },
    uploadBtn: {
        background: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        padding: '0.6rem',
        fontWeight: '600',
        fontSize: '0.9rem',
        transition: 'all 0.2s',
    },
};

export default ImageUpload;
