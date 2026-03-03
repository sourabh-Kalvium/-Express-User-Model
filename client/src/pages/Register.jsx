import React from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2>Create an Account</h2>
                <form style={styles.form} onSubmit={(e) => e.preventDefault()}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Full Name</label>
                        <input type="text" placeholder="Enter your name" style={styles.input} />
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Email</label>
                        <input type="email" placeholder="Enter your email" style={styles.input} />
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Password</label>
                        <input type="password" placeholder="Create a password" style={styles.input} />
                    </div>
                    <button type="submit" style={styles.button}>Register</button>
                </form>
                <p style={styles.helperText}>
                    Already have an account? <Link to="/login">Login here</Link>
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
    label: {
        fontWeight: 'bold',
    },
    input: {
        padding: '0.75rem',
        borderRadius: '4px',
        border: '1px solid #ccc',
        fontSize: '1rem',
    },
    button: {
        padding: '0.75rem',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '1rem',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
    helperText: {
        marginTop: '1.5rem',
        textAlign: 'center',
        fontSize: '0.9rem',
    }
};

export default Register;
