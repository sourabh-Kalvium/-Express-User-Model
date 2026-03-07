import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Dashboard = () => {
    // ProtectedRoute handles redirection if not authenticated
    // All we need here is user data and logout from context
    const { user, loading, logout } = useAuth();
    const [profile, setProfile] = useState(null);
    const [fetchError, setFetchError] = useState('');

    useEffect(() => {
        if (!loading && user) {
            // Demonstrate an authenticated Axios API call — interceptor attaches JWT automatically
            api.get('/users/me')
                .then(res => setProfile(res.data.data))
                .catch(err => {
                    setFetchError(err.response?.data?.message || 'Failed to fetch profile');
                });
        }
    }, [loading, user]);

    if (loading) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
    }

    if (!user) return null;

    return (
        <div style={styles.container}>
            <div style={styles.sidebar}>
                <ul style={styles.navList}>
                    <li style={styles.navItemActive}>My Profile</li>
                    <li style={styles.navItem}>My Articles</li>
                    <li style={styles.navItem}>Settings</li>
                    <li
                        style={{ ...styles.navItem, color: 'red', cursor: 'pointer' }}
                        onClick={logout}
                    >
                        Logout
                    </li>
                </ul>
            </div>
            <div style={styles.mainContent}>
                <h2>Welcome back, {user.name}!</h2>
                <p style={{ color: '#666', marginBottom: '0.5rem' }}>Email: {user.email}</p>

                {/* Show live data fetched from the protected /me endpoint */}
                {fetchError && (
                    <p style={{ color: 'red', fontSize: '0.9rem' }}>⚠️ {fetchError}</p>
                )}
                {profile && (
                    <div style={styles.profileBadge}>
                        ✅ Profile verified via protected <code>/api/users/me</code> endpoint
                        <br />
                        <small>Account created: {new Date(profile.createdAt).toLocaleDateString()}</small>
                    </div>
                )}

                <div style={styles.statsGrid}>
                    <div style={styles.statCard}>
                        <h3>Total Views</h3>
                        <p style={styles.statValue}>12,450</p>
                    </div>
                    <div style={styles.statCard}>
                        <h3>Articles Published</h3>
                        <p style={styles.statValue}>8</p>
                    </div>
                    <div style={styles.statCard}>
                        <h3>New Followers</h3>
                        <p style={styles.statValue}>142</p>
                    </div>
                </div>

                <div style={styles.recentActivity}>
                    <h3>Recent Activity</h3>
                    <ul style={styles.activityList}>
                        <li style={styles.activityItem}>You published "Understanding React 19"</li>
                        <li style={styles.activityItem}>User JohnDoe commented on your article.</li>
                        <li style={styles.activityItem}>You updated your profile picture.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        minHeight: '80vh',
        maxWidth: '1200px',
        margin: '2rem auto',
        gap: '2rem',
        paddingBottom: '80px',
    },
    sidebar: {
        width: '250px',
        borderRight: '1px solid #eee',
        paddingRight: '1rem',
    },
    navList: {
        listStyleType: 'none',
        padding: 0, margin: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    navItem: { padding: '0.75rem 1rem', borderRadius: '4px', cursor: 'pointer' },
    navItemActive: {
        padding: '0.75rem 1rem',
        borderRadius: '4px',
        cursor: 'pointer',
        backgroundColor: '#007bff',
        color: 'white',
        fontWeight: 'bold',
    },
    mainContent: { flex: 1 },
    profileBadge: {
        backgroundColor: '#d4edda',
        border: '1px solid #c3e6cb',
        color: '#155724',
        padding: '0.75rem 1rem',
        borderRadius: '6px',
        marginBottom: '1.5rem',
        fontSize: '0.9rem',
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.5rem',
        marginTop: '1.5rem',
        marginBottom: '3rem',
    },
    statCard: {
        padding: '1.5rem',
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: '#f8f9fa',
        textAlign: 'center',
    },
    statValue: {
        fontSize: '2rem',
        fontWeight: 'bold',
        color: '#007bff',
        margin: '0.5rem 0 0 0',
    },
    recentActivity: { borderTop: '1px solid #eee', paddingTop: '1.5rem' },
    activityList: { listStyleType: 'circle', paddingLeft: '1.5rem', marginTop: '1rem' },
    activityItem: { marginBottom: '0.75rem', color: '#555' }
};

export default Dashboard;
