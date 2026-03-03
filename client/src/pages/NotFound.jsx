import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div style={styles.container}>
            <h1 style={styles.errorCode}>404</h1>
            <h2 style={styles.message}>Page Not Found</h2>
            <p style={styles.description}>
                Oops! The page you are looking for doesn't exist or has been moved.
            </p>
            <Link to="/" style={styles.button}>Return to Home</Link>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '70vh',
        textAlign: 'center',
        padding: '2rem',
    },
    errorCode: {
        fontSize: '6rem',
        color: '#dc3545',
        margin: 0,
        lineHeight: 1,
    },
    message: {
        fontSize: '2rem',
        marginTop: '1rem',
        marginBottom: '1rem',
    },
    description: {
        color: '#6c757d',
        marginBottom: '2rem',
        maxWidth: '500px',
    },
    button: {
        padding: '0.75rem 1.5rem',
        backgroundColor: '#007bff',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '4px',
        fontWeight: 'bold',
    }
};

export default NotFound;
