import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        // 1. Check for token
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (!token || !userData) {
            // Not logged in -> redirect to login
            navigate('/login');
            return;
        }

        // 2. Set user data
        setUser(JSON.parse(userData));
    }, [navigate]);

    if (!user) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading dashboard...</div>;
    }

    return (
        <div style={styles.container}>
            <div style={styles.sidebar}>
                <ul style={styles.navList}>
                    <li style={styles.navItemActive}>My Profile</li>
                    <li style={styles.navItem}>My Articles</li>
                    <li style={styles.navItem}>Settings</li>
                    <li
                        style={{ ...styles.navItem, color: 'red' }}
                        onClick={() => {
                            localStorage.removeItem('token');
                            localStorage.removeItem('user');
                            navigate('/login');
                        }}
                    >
                        Logout
                    </li>
                </ul>
            </div>
            <div style={styles.mainContent}>
                <h2>Welcome back, {user.name}!</h2>
                <p style={{ color: '#666', marginBottom: '2rem' }}>Email: {user.email}</p>

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
        padding: 0,
        margin: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    navItem: {
        padding: '0.75rem 1rem',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
    },
    navItemActive: {
        padding: '0.75rem 1rem',
        borderRadius: '4px',
        cursor: 'pointer',
        backgroundColor: '#007bff',
        color: 'white',
        fontWeight: 'bold',
    },
    mainContent: {
        flex: 1,
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
    recentActivity: {
        borderTop: '1px solid #eee',
        paddingTop: '1.5rem',
    },
    activityList: {
        listStyleType: 'circle',
        paddingLeft: '1.5rem',
        marginTop: '1rem',
    },
    activityItem: {
        marginBottom: '0.75rem',
        color: '#555',
    }
};

export default Dashboard;
