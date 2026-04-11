import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import ImageUpload from '../components/ImageUpload';

const CreatePost = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [coverImageUrl, setCoverImageUrl] = useState(null);
    const [imageUploading, setImageUploading] = useState(false);

    const handleUpload = async (formData) => {
        setImageUploading(true);
        setError('');
        try {
            const res = await api.post('/upload', formData);
            if (res.data.success) {
                setCoverImageUrl(res.data.url);
                toast.success('Image uploaded successfully!');
                console.log('Cloudinary URL:', res.data.url);
                
                // TODO: Orphaned upload problem. If the user uploads multiple images 
                // before submitting the post, previous uploads will remain on Cloudinary.
                // Future improvement: Delete old image using public_id before setting new URL.
            }
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to upload image';
            setError(msg);
            toast.error(msg);
        } finally {
            setImageUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!title.trim() || !content.trim()) {
            setError('Title and content are required.');
            return;
        }

        setLoading(true);
        try {
            // api.js interceptor automatically attaches Authorization header
            await api.post('/posts', { 
                title, 
                content, 
                tags,
                coverImage: coverImageUrl 
            });

            setSuccess('Post created successfully! Redirecting to dashboard...');
            toast.success('Post created successfully!');
            setTitle('');
            setContent('');
            setTags('');
            setCoverImageUrl(null);
            setTimeout(() => navigate('/dashboard'), 1500);

        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to create post';
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.heading}>✍️ Create New Post</h2>

                {error && <div style={styles.errorAlert}>{error}</div>}
                {success && <div style={styles.successAlert}>{success}</div>}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Title *</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter post title"
                            style={styles.input}
                            maxLength={120}
                        />
                        <small style={styles.hint}>{title.length}/120 characters</small>
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Content *</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Write your post content here..."
                            style={styles.textarea}
                            rows={8}
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Tags (comma-separated)</label>
                        <input
                            type="text"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            placeholder="e.g. React, JavaScript, Node.js"
                            style={styles.input}
                        />
                    </div>

                    {/* Image Upload Component */}
                    <div style={styles.formGroup}>
                        <ImageUpload onUpload={handleUpload} />
                        {imageUploading && <p style={styles.loadingText}>⌛ Uploading image, please wait...</p>}
                        {coverImageUrl && !imageUploading && <p style={styles.successText}>✅ Image ready for post!</p>}
                    </div>

                    <div style={styles.btnRow}>
                        <button
                            type="button"
                            style={styles.cancelBtn}
                            onClick={() => navigate('/dashboard')}
                        >
                            Cancel
                        </button>
                        <button type="submit" style={styles.submitBtn} disabled={loading || imageUploading}>
                            {loading ? 'Publishing...' : 'Publish Post'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const styles = {
    container: { padding: '2rem', maxWidth: '800px', margin: '0 auto', paddingBottom: '80px' },
    card: {
        background: '#fff',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
        border: '1px solid #eee',
    },
    heading: { marginTop: 0, color: '#333', marginBottom: '1.5rem' },
    form: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },
    formGroup: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
    label: { fontWeight: '600', color: '#444', fontSize: '0.95rem' },
    input: {
        padding: '0.75rem',
        borderRadius: '6px',
        border: '1px solid #ccc',
        fontSize: '1rem',
        outline: 'none',
    },
    textarea: {
        padding: '0.75rem',
        borderRadius: '6px',
        border: '1px solid #ccc',
        fontSize: '1rem',
        resize: 'vertical',
        fontFamily: 'inherit',
        outline: 'none',
    },
    hint: { color: '#888', fontSize: '0.8rem' },
    btnRow: { display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '0.5rem' },
    cancelBtn: {
        padding: '0.75rem 1.5rem',
        borderRadius: '6px',
        border: '1px solid #ccc',
        background: '#fff',
        cursor: 'pointer',
        fontSize: '1rem',
    },
    submitBtn: {
        padding: '0.75rem 1.75rem',
        borderRadius: '6px',
        border: 'none',
        background: '#007bff',
        color: '#fff',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: '600',
    },
    errorAlert: {
        padding: '0.75rem 1rem', backgroundColor: '#f8d7da',
        color: '#721c24', borderRadius: '6px', border: '1px solid #f5c6cb',
    },
    successAlert: {
        padding: '0.75rem 1rem', backgroundColor: '#d4edda',
        color: '#155724', borderRadius: '6px', border: '1px solid #c3e6cb',
    },
    loadingText: { color: '#007bff', fontSize: '0.9rem', marginTop: '0.5rem', fontWeight: '500' },
    successText: { color: '#28a745', fontSize: '0.9rem', marginTop: '0.5rem', fontWeight: '500' },
};

export default CreatePost;
