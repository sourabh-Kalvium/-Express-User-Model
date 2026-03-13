const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const cloudinary = require('../config/cloudinary');
const { protect } = require('../middleware/authMiddleware');

// @desc    Upload image to Cloudinary
// @route   POST /api/upload
// @access  Protected
router.post('/', protect, upload.single('image'), async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        // Promise wrapper for cloudinary upload_stream
        const uploadToCloudinary = (buffer) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: 'creators-platform' },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                stream.end(buffer);
            });
        };

        const result = await uploadToCloudinary(req.file.buffer);

        res.status(200).json({
            success: true,
            url: result.secure_url,
            publicId: result.public_id
        });

    } catch (error) {
        next(error);
    }
}, (error, req, res, next) => {
    // 4-parameter error-handling middleware for Multer errors
    if (error instanceof require('multer').MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ success: false, message: 'File too large. Max limit is 5MB' });
        }
        return res.status(400).json({ success: false, message: error.message });
    }
    
    // For our filter error
    if (error.message === 'Only image files (JPEG, PNG, WEBP, GIF) are allowed.') {
        return res.status(400).json({ success: false, message: error.message });
    }

    res.status(500).json({ success: false, message: error.message || 'Server side error during upload' });
});

module.exports = router;
