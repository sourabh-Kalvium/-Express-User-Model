import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute - Guards routes that require authentication.
 * - Shows a loading state while auth is being restored (e.g., on page refresh).
 * - Redirects unauthenticated users to /login.
 * - Renders children only when the user is authenticated.
 */
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    // Wait for auth state to be restored from localStorage before deciding
    if (loading) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Checking authentication...</div>;
    }

    if (!isAuthenticated()) {
        // Not logged in — redirect to login page
        return <Navigate to="/login" replace />;
    }

    // Authenticated — render the protected content
    return children;
};

export default ProtectedRoute;
