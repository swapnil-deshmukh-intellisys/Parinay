const request = require('supertest');
const Contact = require('../models/Contact');

process.env.NODE_ENV = 'test';
const app = require('../server');

describe('Contact API', () => {
  beforeEach(async () => {
    await Contact.deleteMany({});
  });

  afterAll(async () => {
    await Contact.deleteMany({});
  });

  describe('POST /api/contact', () => {
    test('should create a contact message', async () => {
      const contactData = {
        fullName: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'This is a test message'
      };

      const response = await request(app)
        .post('/api/contact')
        .send(contactData)
        .expect(201);

      expect(response.body.message).toContain('success');
    });

    test('should return 400 if required fields are missing', async () => {
      const contactData = {
        fullName: 'John Doe',
        email: 'john@example.com'
        // Missing subject and message
      };

      const response = await request(app)
        .post('/api/contact')
        .send(contactData)
        .expect(400);

      expect(response.body.message).toBeDefined();
    });
  });
});
