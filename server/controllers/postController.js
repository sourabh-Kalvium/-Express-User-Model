const postsService = require('../services/posts.service');

// @desc    Create a new post
// @route   POST /api/posts
// @access  Protected
const createPost = async (req, res, next, io) => {
    try {
        const post = await postsService.createPost(req.body, req.user._id);
        res.status(201).json({ success: true, data: post });
    } catch (error) {
        if (error.message === 'Title and content are required') {
            return res.status(400).json({ success: false, message: error.message });
        }
        next(error);
    }
};

// @desc    Get paginated posts for the logged-in user
// @route   GET /api/posts?page=1&limit=5
// @access  Protected
const getPosts = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;

        const result = await postsService.getPosts(req.user._id, page, limit);

        res.status(200).json({
            success: true,
            data: result.posts,
            pagination: result.pagination,
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get a single post by ID
// @route   GET /api/posts/:id
// @access  Protected
const getPostById = async (req, res, next) => {
    try {
        const post = await postsService.getPostById(req.params.id);
        res.status(200).json({ success: true, data: post });
    } catch (error) {
        if (error.message === 'Post not found') {
            return res.status(404).json({ success: false, message: error.message });
        }
        next(error);
    }
};

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Protected (owner only)
const updatePost = async (req, res, next) => {
    try {
        const updatedPost = await postsService.updatePost(req.params.id, req.user._id, req.body);
        res.status(200).json({ success: true, data: updatedPost });
    } catch (error) {
        if (error.message === 'Post not found') {
            return res.status(404).json({ success: false, message: error.message });
        }
        if (error.statusCode === 403) {
            return res.status(403).json({ success: false, message: error.message });
        }
        if (error.message === 'Title and content are required') {
            return res.status(400).json({ success: false, message: error.message });
        }
        next(error);
    }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Protected (owner only)
const deletePost = async (req, res, next) => {
    try {
        await postsService.deletePost(req.params.id, req.user._id);
        res.status(200).json({ success: true, message: 'Post deleted successfully' });
    } catch (error) {
        if (error.message === 'Post not found') {
            return res.status(404).json({ success: false, message: error.message });
        }
        if (error.statusCode === 403) {
            return res.status(403).json({ success: false, message: error.message });
        }
        next(error);
    }
};

module.exports = { createPost, getPosts, getPostById, updatePost, deletePost };
