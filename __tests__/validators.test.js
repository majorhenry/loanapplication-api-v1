const httpMocks = require('node-mocks-http');
const {validationResult} = require('express-validator');
const loanValidationMiddleware = require('../middleware/validators.js');

describe('Loan Application Validation Middleware', () => {
  const runMiddleware = (middleware, req, res) => {
    return new Promise((resolve, reject) => {
      const res = httpMocks.createResponse();
      const next = (err) => {
        if (err) return reject(err);
        resolve();
      };
      middleware(req, res, next);
    });
  };

  it('should pass with valid input', async () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      body: {
        amount: 10000,
        term_months: 24,
        annual_interest_rate: 5.5
      }
    });
    const res = httpMocks.createResponse();

    for (let mw of loanValidationMiddleware) {
      await runMiddleware(mw, req, res);
    }

    const errors = validationResult(req);
    expect(errors.isEmpty()).toBe(true);
    expect(res._getStatusCode()).toBe(200);
  });

  it('should fail when amount is missing', async () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      body: {
        term_months: 24,
        annual_interest_rate: 5.5
      }
    });

    await expect(runMiddleware(loanValidationMiddleware, req)).rejects.toBeTruthy();
  });

  it('should fail when term_months is negative', async () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      body: {
        amount: 10000,
        term_months: -12,
        annual_interest_rate: 5.5
      }
    });

    await expect(runMiddleware(loanValidationMiddleware, req)).rejects.toBeTruthy();
  });

  it('should fail when annual_interest_rate is 0', async () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      body: {
        amount: 10000,
        term_months: 24,
        annual_interest_rate: 0
      }
    });

    await expect(runMiddleware(loanValidationMiddleware, req)).rejects.toBeTruthy();
  });
});