const User = require('../models/User');
const bcrypt = require('bcryptjs');

const registerUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        // 1. Backend Validation
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields (name, email, password)'
            });
        }

        // 2. Check if user with email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // 3. Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 4. Create new User document in MongoDB
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        // 5. Send success response (but never send back the password!)
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                _id: user.id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt
            }
        });

    } catch (error) {
        next(error);
    }
};

// JWT Authentication addition
const jwt = require('jsonwebtoken');

// Generate JWT token helper
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '30d',
    });
};

const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // 1. Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // 2. Find user in Database
        const user = await User.findOne({ email }).select('+password'); // select password because it is hidden by default in the schema (likely)

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // 3. Compare passwords using bcrypt
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // 4. Generate JWT token
        const token = generateToken(user._id);

        // 5. Send cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict', // recommended for CSRF protection
            maxAge: 3600000 // 1 hour
        });

        res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            data: {
                _id: user.id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        next(error);
    }
};

const logoutUser = async (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0)
    });
    res.status(200).json({ success: true, message: 'Logged out successfully' });
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser
};
