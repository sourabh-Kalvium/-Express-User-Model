const Post = require('../models/Post');

// @desc    Create a new post
// @route   POST /api/posts
// @access  Protected
const createPost = async (req, res) => {
    try {
        const { title, content, tags } = req.body;

        if (!title || !content) {
            return res.status(400).json({ success: false, message: 'Title and content are required' });
        }

        const post = await Post.create({
            title,
            content,
            tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
            author: req.user._id, // from protect middleware
        });

        res.status(201).json({ success: true, data: post });

    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({ success: false, message: messages.join(', ') });
        }
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Get paginated posts for the logged-in user
// @route   GET /api/posts?page=1&limit=5
// @access  Protected
const getPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        // Count only this user's posts
        const total = await Post.countDocuments({ author: req.user._id });
        const totalPages = Math.ceil(total / limit);

        const posts = await Post.find({ author: req.user._id })
            .sort({ createdAt: -1 }) // newest first
            .skip(skip)
            .limit(limit)
            .populate('author', 'name email');

        res.status(200).json({
            success: true,
            data: posts,
            pagination: {
                total,
                totalPages,
                currentPage: page,
                limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = { createPost, getPosts };
