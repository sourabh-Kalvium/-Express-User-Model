const Post = require('../models/Post');

// Create a new post
const createPost = async (postData, authorId) => {
    const { title, content, tags, coverImage } = postData;

    if (!title || !content) {
        throw new Error('Title and content are required');
    }

    const post = await Post.create({
        title,
        content,
        tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        author: authorId,
        coverImage: coverImage || null,
    });

    return post;
};

// Get paginated posts for an author
const getPosts = async (authorId, page = 1, limit = 5) => {
    const skip = (page - 1) * limit;

    const total = await Post.countDocuments({ author: authorId });
    const totalPages = Math.ceil(total / limit);

    const posts = await Post.find({ author: authorId })
        .sort({ createdAt: -1 }) // newest first
        .skip(skip)
        .limit(limit)
        .populate('author', 'name email');

    return {
        posts,
        pagination: {
            total,
            totalPages,
            currentPage: page,
            limit,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
        }
    };
};

// Get a single post by ID
const getPostById = async (postId) => {
    const post = await Post.findById(postId).populate('author', 'name email');
    if (!post) {
        throw new Error('Post not found');
    }
    return post;
};

// Update a post
const updatePost = async (postId, authorId, updateData) => {
    const post = await Post.findById(postId);

    if (!post) {
        throw new Error('Post not found');
    }

    // Ownership check — only the author can update
    if (post.author.toString() !== authorId.toString()) {
        const error = new Error('Not authorized to update this post');
        error.statusCode = 403;
        throw error;
    }

    const { title, content, tags, coverImage } = updateData;

    if (!title || !content) {
        throw new Error('Title and content are required');
    }

    post.title = title.trim();
    post.content = content.trim();
    if (tags !== undefined) {
        post.tags = tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [];
    }
    if (coverImage !== undefined) {
        post.coverImage = coverImage;
    }

    const updatedPost = await post.save();
    return updatedPost;
};

// Delete a post
const deletePost = async (postId, authorId) => {
    const post = await Post.findById(postId);

    if (!post) {
        throw new Error('Post not found');
    }

    // Ownership check — only the author can delete
    if (post.author.toString() !== authorId.toString()) {
        const error = new Error('Not authorized to delete this post');
        error.statusCode = 403;
        throw error;
    }

    await post.deleteOne();
    return true;
};

module.exports = {
    createPost,
    getPosts,
    getPostById,
    updatePost,
    deletePost
};
