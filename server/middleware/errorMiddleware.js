/**
 * Centralized Error Handling Middleware
 * (err, req, res, next) - Four parameters are required for Express to recognize this as error middleware
 */
const errorMiddleware = (err, req, res, next) => {
    console.error('API Error:', err);

    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
};

module.exports = errorMiddleware;
