import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';

const Register = () => {
    const navigate = useNavigate();

    // 1. Form State Management
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [apiError, setApiError] = useState('');

    // (Challenge 2) Password toggle states
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // 2. Input Change Handler
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear validation error when user begins typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // 3. Client-Side Validation Logic
    const validateForm = () => {
        const newErrors = {};

        // Name Validation
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        } else if (formData.name.trim().length > 50) {
            newErrors.name = 'Name cannot exceed 50 characters';
        }

        // Email Validation
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email.trim())) {
                newErrors.email = 'Please enter a valid email address';
            }
        }

        // Password Validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        // Confirm Password Validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // 4. Form Submission Handler
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page reload

        setSuccessMessage('');
        setApiError('');

        if (!validateForm()) return; // Stop if frontend validation fails

        setIsLoading(true);

        try {
            const response = await api.post('/users/register', {
                name: formData.name.trim(),
                email: formData.email.trim().toLowerCase(),
                password: formData.password
            });

            // Registration successful
            setSuccessMessage('Account created successfully! Redirecting...');
            toast.success('Account created successfully!');
            setFormData({ name: '', email: '', password: '', confirmPassword: '' });

            // Redirect to login after 2 seconds
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (err) {
            // Axios error or network error
            const msg = err.response?.data?.message || err.message || 'Registration failed';
            setApiError(msg);
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Create an Account</h2>
                <p style={styles.subtitle}>Join TechBlog today!</p>

                {apiError && <div style={styles.alertError}>{apiError}</div>}
                {successMessage && <div style={styles.alertSuccess}>{successMessage}</div>}

                <form style={styles.form} onSubmit={handleSubmit} noValidate>
                    {/* Name Field */}
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Full Name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your name"
                            style={errors.name ? { ...styles.input, ...styles.inputError } : styles.input}
                            value={formData.name}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                        {errors.name && <span style={styles.errorText}>{errors.name}</span>}
                    </div>

                    {/* Email Field */}
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            style={errors.email ? { ...styles.input, ...styles.inputError } : styles.input}
                            value={formData.email}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                        {errors.email && <span style={styles.errorText}>{errors.email}</span>}
                    </div>

                    {/* Password Field */}
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Password</label>
                        <div style={styles.passwordWrapper}>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Create a password"
                                style={errors.password ? { ...styles.input, ...styles.inputError, paddingRight: '40px' } : { ...styles.input, paddingRight: '40px' }}
                                value={formData.password}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                style={styles.toggleBtn}
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex="-1"
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                        {errors.password && <span style={styles.errorText}>{errors.password}</span>}
                    </div>

                    {/* Confirm Password Field */}
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Confirm Password</label>
                        <div style={styles.passwordWrapper}>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                placeholder="Confirm your password"
                                style={errors.confirmPassword ? { ...styles.input, ...styles.inputError, paddingRight: '40px' } : { ...styles.input, paddingRight: '40px' }}
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                style={styles.toggleBtn}
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                tabIndex="-1"
                            >
                                {showConfirmPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                        {errors.confirmPassword && <span style={styles.errorText}>{errors.confirmPassword}</span>}
                    </div>

                    <button
                        type="submit"
                        style={isLoading ? { ...styles.button, ...styles.buttonDisabled } : styles.button}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <p style={styles.helperText}>
                    Already have an account? <Link to="/login" style={styles.link}>Login here</Link>
                </p>
            </div>
        </div>
    );
};

// 5. Styles
const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
        paddingBottom: '80px',
        backgroundColor: '#f8f9fa'
    },
    card: {
        border: '1px solid #dee2e6',
        borderRadius: '12px',
        padding: '2.5rem',
        width: '100%',
        maxWidth: '450px',
        backgroundColor: 'white',
        boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
    },
    title: {
        margin: '0 0 0.5rem 0',
        color: '#212529',
        textAlign: 'center',
    },
    subtitle: {
        margin: '0 0 1.5rem 0',
        color: '#6c757d',
        textAlign: 'center',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.4rem',
    },
    label: {
        fontWeight: '600',
        fontSize: '0.9rem',
        color: '#495057',
    },
    input: {
        padding: '0.8rem',
        borderRadius: '6px',
        border: '1px solid #ced4da',
        fontSize: '1rem',
        outline: 'none',
        transition: 'border-color 0.2s',
        width: '100%',
    },
    inputError: {
        borderColor: '#dc3545',
        backgroundColor: '#fff8f8',
    },
    passwordWrapper: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
    },
    toggleBtn: {
        position: 'absolute',
        right: '10px',
        background: 'none',
        border: 'none',
        color: '#6c757d',
        cursor: 'pointer',
        fontSize: '0.85rem',
        fontWeight: '600',
    },
    errorText: {
        color: '#dc3545',
        fontSize: '0.85rem',
        marginTop: '0.2rem',
    },
    alertError: {
        padding: '0.8rem',
        backgroundColor: '#f8d7da',
        color: '#721c24',
        borderRadius: '6px',
        marginBottom: '1.5rem',
        fontSize: '0.9rem',
        border: '1px solid #f5c6cb',
    },
    alertSuccess: {
        padding: '0.8rem',
        backgroundColor: '#d4edda',
        color: '#155724',
        borderRadius: '6px',
        marginBottom: '1.5rem',
        fontSize: '0.9rem',
        border: '1px solid #c3e6cb',
    },
    button: {
        padding: '0.9rem',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        fontSize: '1rem',
        cursor: 'pointer',
        fontWeight: 'bold',
        marginTop: '0.5rem',
        transition: 'background-color 0.2s',
    },
    buttonDisabled: {
        backgroundColor: '#6c757d',
        cursor: 'not-allowed',
    },
    helperText: {
        marginTop: '1.5rem',
        textAlign: 'center',
        fontSize: '0.9rem',
        color: '#6c757d',
    },
    link: {
        color: '#007bff',
        textDecoration: 'none',
        fontWeight: '600',
    }
};

export default Register;
