import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { toast as toastifyToast } from 'react-toastify';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { socket } from '../services/socket';

const Dashboard = () => {
    const { user, loading: authLoading, logout, token } = useAuth();

    // Socket.io Connection Logic
    useEffect(() => {
        if (!token) return; // wait for token to be available

        // Pass JWT inside the auth option
        socket.auth = { token };
        // Connect the socket
        socket.connect();

        // Socket Event Listeners
        socket.on('connect', () => {
            console.log('Connected with socket ID:', socket.id);
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from server');
        });

        socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
        });

        // Listen for new posts
        socket.on('newPost', (post) => {
            // Check if the author is the current user. If so, don't show toast (optional but good practice)
            // But we can also just show it for everyone to fulfill requirements.
            toast.success(`New post created: ${post.title} by ${post.author?.name || 'Unknown'}`, {
                duration: 4000,
                position: 'top-right',
            });
        });

        // Cleanup on unmount
        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('connect_error');
            socket.off('newPost');
            socket.disconnect();
        };
    }, [token]);

    // Posts state
    const [posts, setPosts] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [page, setPage] = useState(1);
    const [postsLoading, setPostsLoading] = useState(false);
    const [postsError, setPostsError] = useState('');

    const LIMIT = 5;

    const fetchPosts = useCallback(async (currentPage) => {
        setPostsLoading(true);
        setPostsError('');
        try {
            const res = await api.get(`/posts?page=${currentPage}&limit=${LIMIT}`);
            setPosts(res.data.data);
            setPagination(res.data.pagination);
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to load posts';
            setPostsError(msg);
            toastifyToast.error(msg);
        } finally {
            setPostsLoading(false);
        }
    }, []);

    const handleDelete = async (postId) => {
        if (!window.confirm('Are you sure you want to delete this post?')) return;

        // Optimistic UI update: remove post from state immediately
        const previousPosts = [...posts];
        setPosts(posts.filter(p => p._id !== postId));

        try {
            await api.delete(`/posts/${postId}`);
            toastifyToast.success('Post deleted successfully');
        } catch (err) {
            // Rollback on error
            setPosts(previousPosts);
            const msg = err.response?.data?.message || 'Failed to delete post';
            toastifyToast.error(msg);
        }
    };

    useEffect(() => {
        if (!authLoading && user) {
            fetchPosts(page);
        }
    }, [authLoading, user, page, fetchPosts]);

    if (authLoading) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
    }
    if (!user) return null;

    return (
        <div style={styles.container}>
            {/* Sidebar */}
            <div style={styles.sidebar}>
                <div style={styles.userCard}>
                    <div style={styles.avatar}>{user.name?.charAt(0).toUpperCase()}</div>
                    <p style={styles.userName}>{user.name}</p>
                    <p style={styles.userEmail}>{user.email}</p>
                </div>
                <ul style={styles.navList}>
                    <li style={styles.navItemActive}>📝 My Posts</li>
                    <li style={styles.navItem} onClick={logout}>🚪 Logout</li>
                </ul>
            </div>

            {/* Main Content */}
            <div style={styles.main}>
                <div style={styles.topBar}>
                    <h2 style={styles.heading}>My Posts</h2>
                    <Link to="/create-post" style={styles.createBtn}>+ New Post</Link>
                </div>

                {/* Loading State */}
                {postsLoading && <div style={styles.stateMsg}>Loading posts...</div>}

                {/* Error State */}
                {postsError && <div style={styles.errorBox}>{postsError}</div>}

                {/* Empty State */}
                {!postsLoading && !postsError && posts.length === 0 && (
                    <div style={styles.emptyBox}>
                        <p>You haven't published any posts yet.</p>
                        <Link to="/create-post" style={styles.createBtn}>Write your first post →</Link>
                    </div>
                )}

                {/* Post List */}
                {!postsLoading && posts.length > 0 && (
                    <div style={styles.postList}>
                        {posts.map(post => (
                            <div key={post._id} style={styles.postCard}>
                                {post.coverImage && (
                                    <div style={styles.coverImageContainer}>
                                        <img 
                                            src={post.coverImage} 
                                            alt={`Cover for ${post.title}`} 
                                            style={styles.coverImage} 
                                        />
                                    </div>
                                )}
                                <h3 style={styles.postTitle}>{post.title}</h3>
                                <p style={styles.postContent}>
                                    {post.content.length > 180
                                        ? post.content.slice(0, 180) + '...'
                                        : post.content}
                                </p>
                                <div style={styles.postMeta}>
                                    <div style={styles.tags}>
                                        {post.tags.map(tag => (
                                            <span key={tag} style={styles.tag}>{tag}</span>
                                        ))}
                                    </div>
                                    <span style={styles.date}>
                                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric', month: 'short', day: 'numeric'
                                        })}
                                    </span>
                                </div>
                                <div style={styles.postActions}>
                                    <Link to={`/edit-post/${post._id}`} style={styles.editBtn}>✏️ Edit</Link>
                                    <button
                                        onClick={() => handleDelete(post._id)}
                                        style={styles.deleteBtn}
                                    >
                                        🗑️ Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination Controls */}
                {pagination && pagination.totalPages > 1 && (
                    <div style={styles.pagination}>
                        <button
                            style={styles.pageBtn}
                            onClick={() => setPage(p => p - 1)}
                            disabled={!pagination.hasPrevPage}
                        >
                            ← Previous
                        </button>
                        <span style={styles.pageInfo}>
                            Page {pagination.currentPage} of {pagination.totalPages}
                            &nbsp;·&nbsp;{pagination.total} posts total
                        </span>
                        <button
                            style={styles.pageBtn}
                            onClick={() => setPage(p => p + 1)}
                            disabled={!pagination.hasNextPage}
                        >
                            Next →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex', minHeight: '80vh', maxWidth: '1200px',
        margin: '2rem auto', gap: '2rem', paddingBottom: '80px', padding: '2rem',
    },
    sidebar: {
        width: '240px', flexShrink: 0,
        borderRight: '1px solid #eee', paddingRight: '1.5rem',
    },
    userCard: { textAlign: 'center', marginBottom: '1.5rem' },
    avatar: {
        width: '60px', height: '60px', borderRadius: '50%',
        background: '#007bff', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.5rem', fontWeight: 'bold', margin: '0 auto 0.75rem',
    },
    userName: { fontWeight: '700', margin: '0 0 0.25rem', color: '#333' },
    userEmail: { fontSize: '0.8rem', color: '#888', margin: 0 },
    navList: { listStyle: 'none', padding: 0, margin: 0 },
    navItem: {
        padding: '0.75rem 1rem', borderRadius: '6px',
        cursor: 'pointer', color: '#555', marginBottom: '0.25rem',
    },
    navItemActive: {
        padding: '0.75rem 1rem', borderRadius: '6px',
        background: '#007bff', color: '#fff',
        fontWeight: '600', marginBottom: '0.25rem',
    },
    main: { flex: 1 },
    topBar: {
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: '1.5rem',
    },
    heading: { margin: 0, color: '#333' },
    createBtn: {
        background: '#007bff', color: '#fff',
        padding: '0.6rem 1.2rem', borderRadius: '6px',
        textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem',
    },
    stateMsg: { textAlign: 'center', padding: '2rem', color: '#888' },
    errorBox: {
        padding: '1rem', backgroundColor: '#f8d7da',
        color: '#721c24', borderRadius: '6px', marginBottom: '1rem',
    },
    emptyBox: {
        textAlign: 'center', padding: '3rem 1rem',
        border: '2px dashed #ddd', borderRadius: '10px', color: '#888',
    },
    postList: { display: 'flex', flexDirection: 'column', gap: '1rem' },
    postCard: {
        border: '1px solid #eee', borderRadius: '10px',
        padding: '1.25rem 1.5rem', background: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    },
    coverImageContainer: {
        width: '100%',
        height: '200px',
        borderRadius: '8px',
        overflow: 'hidden',
        marginBottom: '1rem',
        background: '#eee',
    },
    coverImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    postTitle: { margin: '0 0 0.5rem', color: '#222', fontSize: '1.1rem' },
    postContent: { margin: '0 0 0.75rem', color: '#555', lineHeight: '1.6', fontSize: '0.95rem' },
    postMeta: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    tags: { display: 'flex', gap: '0.4rem', flexWrap: 'wrap' },
    tag: {
        background: '#e8f0fe', color: '#1a56db',
        padding: '0.2rem 0.6rem', borderRadius: '20px',
        fontSize: '0.78rem', fontWeight: '500',
    },
    date: { color: '#aaa', fontSize: '0.82rem', whiteSpace: 'nowrap' },
    pagination: {
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: '1.5rem', marginTop: '2rem',
    },
    pageBtn: {
        padding: '0.6rem 1.2rem', borderRadius: '6px',
        border: '1px solid #ccc', background: '#fff',
        cursor: 'pointer', fontSize: '0.9rem',
    },
    pageInfo: { color: '#555', fontSize: '0.9rem' },
    postActions: {
        display: 'flex',
        gap: '0.75rem',
        marginTop: '1.25rem',
        paddingTop: '1rem',
        borderTop: '1px solid #f5f5f5'
    },
    editBtn: {
        textDecoration: 'none',
        color: '#007bff',
        fontSize: '0.9rem',
        fontWeight: '600',
        padding: '0.4rem 0.8rem',
        borderRadius: '5px',
        border: '1px solid #007bff',
        transition: 'all 0.2s',
    },
    deleteBtn: {
        background: 'none',
        border: '1px solid #dc3545',
        color: '#dc3545',
        cursor: 'pointer',
        fontSize: '0.9rem',
        fontWeight: '600',
        padding: '0.4rem 0.8rem',
        borderRadius: '5px',
        transition: 'all 0.2s',
    },
};

export default Dashboard;
