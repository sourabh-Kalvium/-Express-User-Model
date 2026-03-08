const express = require('express');
const router = express.Router();
const { createPost, getPosts, getPostById, updatePost, deletePost } = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

// All post routes are protected — require valid JWT
router.post('/', protect, createPost);
router.get('/', protect, getPosts);

// Single post operations
router.get('/:id', protect, getPostById);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);

module.exports = router;
