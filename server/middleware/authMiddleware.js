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

    // 1. Check for token in cookies
    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    } 
    // 2. Fallback to Authorization: Bearer <token> header
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
        try {
            // Verify the token with our secret
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach the user document (minus password) to the request
            req.user = await User.findById(decoded.id).select('-password');

            next(); // Token is valid — proceed to the route handler

        } catch (error) {
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
