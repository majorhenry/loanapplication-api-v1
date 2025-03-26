const request = require('supertest');
const pool  = require('../db/index.js');
const app = require('../index.js');

describe('Loan Application Controller', () => {
  let testCustomerId;

  // Setup: Create a test customer before running tests
  beforeAll(async () => {
    const customerResult = await pool.query(`
      INSERT INTO customers (name, email, )
      VALUES ('Test User', 'test@example.com')
      RETURNING id
    `);
    testCustomerId = customerResult.rows[0].id;
  });

  // Cleanup: Remove test data after tests
  afterAll(async () => {
    await pool.query('DELETE FROM loan_applications WHERE customer_id = $1', [testCustomerId]);
    await pool.query('DELETE FROM customers WHERE id = $1', [testCustomerId]);
  });

  // Test creating a loan application
  it('creates a loan application successfully', async () => {
    const loanApplication = {
      customer_id: testCustomerId,
      amount: 5000,
      term_months: 36,
      annual_interest_rate: 5.0
    };

    const response = await request(app)
      .post('/api/loan-applications')
      .send(loanApplication);

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data.amount).toBe(loanApplication.amount);
    expect(response.body.data.term_months).toBe(loanApplication.term_months);
  });

  // Test retrieving a loan application
  it('retrieves a loan application by ID', async () => {
    // First, create a loan application
    const loanApplication = {
      customer_id: testCustomerId,
      amount: 7500,
      term_months: 48,
      annual_interest_rate: 6.0
    };

    const createResponse = await request(app)
      .post('/api/loan-applications')
      .send(loanApplication);

    const loanId = createResponse.body.data.id;

    // Then retrieve it
    const getResponse = await request(app)
      .get(`/api/loan-applications/${loanId}`);

    expect(getResponse.statusCode).toBe(200);
    expect(getResponse.body.success).toBe(true);
    expect(getResponse.body.data.id).toBe(loanId);
    expect(getResponse.body.data.amount).toBe(loanApplication.amount);
  });

  // Test invalid loan application input
  it('rejects loan application with invalid input', async () => {
    const invalidLoanApplication = {
      customer_id: testCustomerId,
      amount: -5000, // Invalid amount
      term_months: 120, // Too long term
      annual_interest_rate: 50.0 // Unrealistic interest rate
    };

    const response = await request(app)
      .post('/api/loan-applications')
      .send(invalidLoanApplication);

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.errors).toBeTruthy();
  });
});
