const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../models/User');

// Set test environment before requiring server
process.env.NODE_ENV = 'test';
const app = require('../server');

describe('Authentication API', () => {
  let mongoServer;

  beforeAll(async () => {
    // Start in-memory MongoDB instance
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    // Connect to in-memory database
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }, 30000);

  afterAll(async () => {
    // Close database connection and stop server
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  }, 30000);

  beforeEach(async () => {
    // Clear database before each test
    await User.deleteMany({});
  });

  describe('POST /api/auth/register', () => {
    test('should register a new user successfully', async () => {
      const userData = {
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        gender: 'Male',
        age: 28,
        city: 'Mumbai'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.message).toBe('User registered successfully');
    });

    test('should return 400 if required fields are missing', async () => {
      const userData = {
        fullName: 'Test User',
        email: 'test@example.com'
        // Missing password, gender, age, city
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.message).toBe('All fields are required');
    });

    test('should return 500 if email already exists', async () => {
      const userData = {
        fullName: 'Test User',
        email: 'duplicate@example.com',
        password: 'password123',
        gender: 'Male',
        age: 28,
        city: 'Mumbai'
      };

      // Create first user
      await User.create(userData);

      // Try to create duplicate
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(500);

      expect(response.body.message).toContain('Server error');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a test user
      await User.create({
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        gender: 'Male',
        age: 28,
        city: 'Mumbai'
      });
    });

    test('should login successfully with valid credentials', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(credentials)
        .expect(200);

      expect(response.body.message).toBe('Login successful');
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe(credentials.email);
    });

    test('should return 400 if email or password is missing', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com' })
        .expect(400);

      expect(response.body.message).toBe('Email and password are required');
    });

    test('should return 401 for invalid credentials', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(credentials)
        .expect(401);

      expect(response.body.message).toBe('Invalid credentials');
    });

    test('should return 401 for non-existent user', async () => {
      const credentials = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(credentials)
        .expect(401);

      expect(response.body.message).toBe('Invalid credentials');
    });
  });
});
