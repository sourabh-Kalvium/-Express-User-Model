require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');

const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        methods: ['GET', 'POST']
    }
});

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB Connected successfully!'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Configure CORS
const corsOptions = {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Socket.io Authentication Middleware
const jwt = require('jsonwebtoken');

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

// Error Middleware
app.use(errorMiddleware);

// Test Endpoint for Frontend Connectivity
app.get('/api/test', (req, res) => {
    res.json({ message: 'CORS and Proxy are working perfectly! Hello from the Express backend!' });
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`CORS is allowing requests from: ${corsOptions.origin}`);
});
