require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Configure CORS
const corsOptions = {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json()); // To parse JSON bodies if needed

// Test Endpoint for Frontend Connectivity
app.get('/api/test', (req, res) => {
    res.json({ message: 'CORS and Proxy are working perfectly! Hello from the Express backend!' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`CORS is allowing requests from: ${corsOptions.origin}`);
});
