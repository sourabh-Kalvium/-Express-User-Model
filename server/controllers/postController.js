const Post = require('../models/Post');

// @desc    Create a new post
// @route   POST /api/posts
// @access  Protected
const createPost = async (req, res, next, io) => {
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

        // Emit a newPost event using io.emit() after saving a post
        if (io) {
            // Populate author before emitting so frontend has all details
            const populatedPost = await post.populate('author', 'name email');
            io.emit('newPost', populatedPost);
        }

        res.status(201).json({ success: true, data: post });

    } catch (error) {
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
        next(error);
    }
};

// @desc    Get a single post by ID
// @route   GET /api/posts/:id
// @access  Protected
const getPostById = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id).populate('author', 'name email');

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        res.status(200).json({ success: true, data: post });

    } catch (error) {
        next(error);
    }
};

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Protected (owner only)
const updatePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        // Ownership check — only the author can update
        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized to update this post' });
        }

        const { title, content, tags } = req.body;

        if (!title || !content) {
            return res.status(400).json({ success: false, message: 'Title and content are required' });
        }

        post.title = title.trim();
        post.content = content.trim();
        post.tags = tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [];

        const updatedPost = await post.save();

        res.status(200).json({ success: true, data: updatedPost });

    } catch (error) {
        next(error);
    }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Protected (owner only)
const deletePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        // Ownership check — only the author can delete
        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this post' });
        }

        await post.deleteOne();

        res.status(200).json({ success: true, message: 'Post deleted successfully' });

    } catch (error) {
        next(error);
    }
};

module.exports = { createPost, getPosts, getPostById, updatePost, deletePost };
