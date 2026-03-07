const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Backend JWT Authentication Middleware
 *
 * Reads the Bearer token from the Authorization header,
 * verifies it, and attaches the authenticated user to req.user.
 *
 * Usage: router.get('/protected', protect, handlerFn)
 */
const protect = async (req, res, next) => {
    let token;

    // Check for the Authorization: Bearer <token> header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify the token with our secret
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach the user document (minus password) to the request
            req.user = await User.findById(decoded.id).select('-password');

            next(); // Token is valid — proceed to the route handler

        } catch (error) {
            console.error('Token verification failed:', error.message);
            return res.status(401).json({
                success: false,
                message: 'Not authorized — invalid or expired token'
            });
        }
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized — no token provided'
        });
    }
};

module.exports = { protect };
