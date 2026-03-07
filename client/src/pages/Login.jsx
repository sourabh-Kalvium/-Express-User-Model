import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Get login function from AuthContext — no direct localStorage or navigate needed here
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        // Basic validation
        if (!email || !password) {
            setError('Please enter both email and password.');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // Delegate token/user storage and redirect to AuthContext
            login(data.data, data.token);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2>Login to TechBlog</h2>

                {error && <div style={styles.errorAlert}>{error}</div>}

                <form style={styles.form} onSubmit={handleLogin}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            style={styles.input}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            style={styles.input}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" style={styles.button} disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <p style={styles.helperText}>
                    Don't have an account? <Link to="/register">Register here</Link>
                </p>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
        paddingBottom: '80px',
    },
    card: {
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '2rem',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        marginTop: '1.5rem',
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    },
    label: { fontWeight: 'bold' },
    input: {
        padding: '0.75rem',
        borderRadius: '4px',
        border: '1px solid #ccc',
        fontSize: '1rem',
    },
    button: {
        padding: '0.75rem',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '1rem',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
    errorAlert: {
        padding: '0.75rem 1rem',
        backgroundColor: '#f8d7da',
        color: '#721c24',
        borderRadius: '4px',
        border: '1px solid #f5c6cb',
        marginTop: '1rem',
    },
    helperText: {
        marginTop: '1.5rem',
        textAlign: 'center',
        fontSize: '0.9rem',
    }
};

export default Login;
