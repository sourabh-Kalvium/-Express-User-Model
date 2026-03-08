import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

const EditPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');

    const [fetchLoading, setFetchLoading] = useState(true);
    const [fetchError, setFetchError] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Fetch the existing post and pre-fill the form
    useEffect(() => {
        const fetchPost = async () => {
            setFetchLoading(true);
            setFetchError('');
            try {
                const res = await api.get(`/posts/${id}`);
                const post = res.data.data;
                setTitle(post.title);
                setContent(post.content);
                setTags(post.tags.join(', '));
            } catch (err) {
                if (err.response?.status === 404) {
                    setFetchError('Post not found.');
                } else if (err.response?.status === 403) {
                    setFetchError('You are not authorized to edit this post.');
                } else {
                    setFetchError('Failed to load post. Please try again.');
                }
            } finally {
                setFetchLoading(false);
            }
        };

        fetchPost();
    }, [id]);

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
            await api.put(`/posts/${id}`, { title, content, tags });
            setSuccess('Post updated successfully! Redirecting...');
            setTimeout(() => navigate('/dashboard'), 1500);
        } catch (err) {
            if (err.response?.status === 403) {
                setError('You are not authorized to edit this post.');
            } else {
                setError(err.response?.data?.message || 'Failed to update post. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    // --- Loading state while fetching the post ---
    if (fetchLoading) {
        return (
            <div style={styles.container}>
                <div style={styles.stateMsg}>Loading post...</div>
            </div>
        );
    }

    // --- Error state (e.g. post not found or not authorized) ---
    if (fetchError) {
        return (
            <div style={styles.container}>
                <div style={styles.card}>
                    <div style={styles.errorAlert}>{fetchError}</div>
                    <button style={styles.cancelBtn} onClick={() => navigate('/dashboard')}>
                        ← Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.heading}>✏️ Edit Post</h2>

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

                    <div style={styles.btnRow}>
                        <button
                            type="button"
                            style={styles.cancelBtn}
                            onClick={() => navigate('/dashboard')}
                        >
                            Cancel
                        </button>
                        <button type="submit" style={styles.submitBtn} disabled={loading}>
                            {loading ? 'Saving...' : 'Save Changes'}
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
    stateMsg: { textAlign: 'center', padding: '3rem', color: '#888', fontSize: '1rem' },
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
        marginBottom: '1rem',
    },
    successAlert: {
        padding: '0.75rem 1rem', backgroundColor: '#d4edda',
        color: '#155724', borderRadius: '6px', border: '1px solid #c3e6cb',
        marginBottom: '1rem',
    },
};

export default EditPost;
