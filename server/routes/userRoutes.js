const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/users/register
// @desc    Register a new user
// @access  Public
router.post('/register', registerUser);

// @route   POST /api/users/login
// @desc    Login user / Return JWT Token
// @access  Public
router.post('/login', loginUser);

// @route   GET /api/users/me
// @desc    Get the currently authenticated user's profile
// @access  Protected — requires valid JWT
router.get('/me', protect, (req, res) => {
    res.status(200).json({
        success: true,
        data: req.user
    });
});

module.exports = router;

