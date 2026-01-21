const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../../models/User');

describe('User Model', () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }, 30000);

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  }, 30000);

  beforeEach(async () => {
    await User.deleteMany({});
  });

  test('should create a new user', async () => {
    const userData = {
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      gender: 'Male',
      age: 28,
      city: 'Mumbai'
    };

    const user = await User.create(userData);
    expect(user._id).toBeDefined();
    expect(user.fullName).toBe(userData.fullName);
    expect(user.email).toBe(userData.email);
  });

  test('should require fullName field', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'password123'
    };

    await expect(User.create(userData)).rejects.toThrow();
  });

  test('should require email field', async () => {
    const userData = {
      fullName: 'Test User',
      password: 'password123'
    };

    await expect(User.create(userData)).rejects.toThrow();
  });

  test('should require password field', async () => {
    const userData = {
      fullName: 'Test User',
      email: 'test@example.com'
    };

    await expect(User.create(userData)).rejects.toThrow();
  });

  test('should enforce unique email constraint', async () => {
    const userData = {
      fullName: 'Test User',
      email: 'duplicate@example.com',
      password: 'password123',
      gender: 'Male',
      age: 28,
      city: 'Mumbai'
    };

    await User.create(userData);
    await expect(User.create(userData)).rejects.toThrow();
  });

  test('should save optional fields', async () => {
    const userData = {
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      gender: 'Female',
      age: 25,
      city: 'Delhi'
    };

    const user = await User.create(userData);
    expect(user.gender).toBe(userData.gender);
    expect(user.age).toBe(userData.age);
    expect(user.city).toBe(userData.city);
  });
});
