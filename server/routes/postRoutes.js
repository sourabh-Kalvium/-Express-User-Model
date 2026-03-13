const express = require('express');
const router = express.Router();
const { createPost, getPosts, getPostById, updatePost, deletePost } = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

module.exports = (io) => {
    // All post routes are protected — require valid JWT
    router.post('/', protect, (req, res, next) => createPost(req, res, next, io));
    router.get('/', protect, getPosts);

    // Single post operations
    router.get('/:id', protect, getPostById);
    router.put('/:id', protect, updatePost);
    router.delete('/:id', protect, deletePost);

    return router;
};
