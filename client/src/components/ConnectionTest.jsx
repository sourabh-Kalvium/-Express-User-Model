import React, { useState, useEffect } from 'react';

const ConnectionTest = () => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Relative API call - will be proxied by Vite in dev and work properly in prod
        fetch('/api/test')
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
            })
            .then(json => {
                setData(json);
                setLoading(false);
            })
            .catch(err => {
                console.error("Connection test failed:", err);
                setError(err.message);
                setLoading(false);
            });
    }, []);

    return (
        <div style={styles.container}>
            <h3 style={styles.title}>Backend Connection Test</h3>

            {loading && <p style={styles.loading}>Testing connection to backend...</p>}

            {error && (
                <div style={styles.error}>
                    <p><strong>Connection Failed:</strong> {error}</p>
                    <p style={styles.hint}>Make sure both frontend (Vite) and backend (Express) servers are running.</p>
                </div>
            )}

            {data && (
                <div style={styles.success}>
                    <p><strong>Connection Successful! 🎉</strong></p>
                    <p>Response from backend: <em>{data.message}</em></p>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        margin: '2rem 0',
        padding: '1.5rem',
        borderRadius: '8px',
        backgroundColor: '#f8f9fa',
        border: '1px solid #dee2e6',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    },
    title: {
        marginTop: 0,
        marginBottom: '1rem',
        color: '#343a40',
    },
    loading: {
        color: '#6c757d',
        fontStyle: 'italic',
    },
    error: {
        padding: '1rem',
        backgroundColor: '#f8d7da',
        color: '#721c24',
        borderRadius: '4px',
        border: '1px solid #f5c6cb',
    },
    success: {
        padding: '1rem',
        backgroundColor: '#d4edda',
        color: '#155724',
        borderRadius: '4px',
        border: '1px solid #c3e6cb',
    },
    hint: {
        fontSize: '0.85rem',
        marginTop: '0.5rem',
        marginBottom: 0,
    }
};

export default ConnectionTest;
