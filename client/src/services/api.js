import axios from 'axios';

/**
 * Centralized Axios API Instance
 *
 * - baseURL is set to '/api' (proxied to backend via Vite in dev)
 * - All requests automatically get the correct base path
 * - Timeout of 10 seconds for all requests
 */
const api = axios.create({
    baseURL: '/api',
    timeout: 10000,
});

// ─── REQUEST INTERCEPTOR ─────────────────────────────────────────────────────
// Runs before every outgoing request.
// Reads the JWT from localStorage and attaches it to the Authorization header.
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ─── RESPONSE INTERCEPTOR ────────────────────────────────────────────────────
// Runs after every incoming response.
// If a 401 Unauthorized is received (expired/invalid token), auto-logout the user.
api.interceptors.response.use(
    (response) => response, // pass successful responses through
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token is expired or invalid — clear auth data and redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
