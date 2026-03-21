const mongoose = require('mongoose');
const { server } = require('./app');

const PORT = process.env.PORT || 5000;

// Database Connection
const dbURI = process.env.NODE_ENV === 'test' 
    ? process.env.MONGODB_URI_TEST 
    : process.env.MONGODB_URI;

mongoose.connect(dbURI)
    .then(() => console.log(`MongoDB Connected successfully to ${dbURI}`))
    .catch((err) => console.error('MongoDB connection error:', err));

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
