import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * PublicRoute - Guards routes that should only be visible when logged OUT.
 * - Redirects already-authenticated users away from /login and /register.
 * - Renders children only when the user is NOT authenticated.
 */
const PublicRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
    }

    if (isAuthenticated()) {
        // Already logged in — redirect to dashboard
        return <Navigate to="/dashboard" replace />;
    }

    // Not logged in — render the public page (login / register)
    return children;
};

export default PublicRoute;
