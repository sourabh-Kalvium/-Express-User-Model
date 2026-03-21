require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        methods: ['GET', 'POST']
    }
});

// Configure CORS
const corsOptions = {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Socket.io Authentication Middleware
io.use((socket, next) => {
    try {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error('Authentication error'));
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.user = decoded; // attaching decoded user to socket
        next();
    } catch (err) {
        next(new Error('Authentication error'));
    }
});

// Socket.io Connection Logic
io.on('connection', (socket) => {
    console.log(`A user connected: ${socket.id}, Email: ${socket.user?.email || 'Unknown'}`);
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes(io));
app.use('/api/upload', uploadRoutes);

// Error Middleware
app.use(errorMiddleware);

// Test Endpoint for Frontend Connectivity
app.get('/api/test', (req, res) => {
    res.json({ message: 'CORS and Proxy are working perfectly! Hello from the Express backend!' });
});

module.exports = { app, server };
