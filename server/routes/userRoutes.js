const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/register', userController.registerUser);
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

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

