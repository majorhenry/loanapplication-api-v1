const request = require('supertest');
const pool = require('../db/index.js');
const app = require('../index.js');

describe('Server Initialization', () => {
  // Test health check endpoint
  it('should respond to health check', async () => {
    const response = await request(app).get('/health');
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('ok');
  });

  // Database connection test
  it('should connect to the database', async () => {
    let client;
    try {
      client = await pool.connect();
      expect(client).toBeTruthy();
    } catch (error) {
      throw new Error('Failed to connect to the database: ' + error.message);
      // fail('Failed to connect to the database: ' + error.message);
    } finally {
      if (client) client.release();
    }
  });

  // Verify environment variables
  it('should have required environment variables', () => {
    expect(process.env.DB_USER).toBeDefined();
    expect(process.env.DB_PASSWORD).toBeDefined();
    expect(process.env.DB_HOST).toBeDefined();
    expect(process.env.DB_NAME).toBeDefined();
  });
});