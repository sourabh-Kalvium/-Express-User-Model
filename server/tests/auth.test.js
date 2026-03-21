const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../app');
const User = require('../models/User');

describe('Authentication Integration Tests', () => {
    
    // Lifecycle hooks
    beforeAll(async () => {
        // Connect to the test database
        const url = process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/blogify_test';
        await mongoose.connect(url);
    });

    afterEach(async () => {
        // Clear test data after each test
        await User.deleteMany({});
    });

    afterAll(async () => {
        // Close the database connection
        await mongoose.connection.close();
    });

    describe('POST /api/users/register', () => {
        it('should register a new user with valid data', async () => {
            const res = await request(app)
                .post('/api/users/register')
                .send({
                    name: 'Test User',
                    email: 'test@example.com',
                    password: 'password123'
                });

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.token).toBeDefined();
            expect(res.body.data.email).toBe('test@example.com');
        });

        it('should fail to register with an existing email', async () => {
            // Pre-create a user
            await User.create({
                name: 'Existing User',
                email: 'existing@example.com',
                password: 'hashed_password'
            });

            const res = await request(app)
                .post('/api/users/register')
                .send({
                    name: 'New User',
                    email: 'existing@example.com',
                    password: 'password123'
                });

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toMatch(/already exists/i);
        });

        it('should fail to register with missing fields', async () => {
            const res = await request(app)
                .post('/api/users/register')
                .send({
                    name: 'No Email User'
                    // missing email and password
                });

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });
    });

    describe('POST /api/users/login', () => {
        beforeEach(async () => {
            // Create a user for login tests
            const bcrypt = require('bcryptjs');
            const hashedPassword = await bcrypt.hash('password123', 10);
            await User.create({
                name: 'Login User',
                email: 'login@example.com',
                password: hashedPassword
            });
        });

        it('should login with correct credentials', async () => {
            const res = await request(app)
                .post('/api/users/login')
                .send({
                    email: 'login@example.com',
                    password: 'password123'
                });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.token).toBeDefined();
        });

        it('should fail to login with wrong password', async () => {
            const res = await request(app)
                .post('/api/users/login')
                .send({
                    email: 'login@example.com',
                    password: 'wrongpassword'
                });

            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toMatch(/invalid credentials/i);
        });
    });
});
