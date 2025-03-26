const httpMocks = require('node-mocks-http');
const { loanValidator } = require('../middleware/validators.js');

// Utility to run each middleware step-by-step like Express does
function runMiddleware(middleware, req, res) {
  return new Promise((resolve, reject) => {
    middleware(req, res, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

jest.setTimeout(10000);

describe('Loan Application Validation Middleware', () => {
  const validBody = {
    customer_id: 1,
    amount: 10000,
    annual_interest_rate: 5.5,
    term_months: 24,
  };

  it('should pass with valid input', async (done) => {
    // jest.setTimeout(10000);
    const req = httpMocks.createRequest({ method: 'POST', body: validBody });
    const res = httpMocks.createResponse();

    for (let mw of loanValidator) {
      await runMiddleware(mw, req, res);
    }

    expect(res._getStatusCode()).toBe(200); // validation passed, no response yet
    done();
  });

  it('should fail when amount is missing', async (done) => {
    // jest.setTimeout(10000);
    const req = httpMocks.createRequest({
      method: 'POST',
      body: {
        customer_id: 1,
        term_months: 12,
        annual_interest_rate: 5,
      },
    });
    const res = httpMocks.createResponse();

    for (let mw of loanValidator) {
      await runMiddleware(mw, req, res);
    }

    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData().errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ param: 'amount' }),
      ])
    );
    done
  });

  it('should fail when months is negative', async (done) => {
    const req = httpMocks.createRequest({
      method: 'POST',
      body: {
        customer_id: 1,
        amount: 5000,
        annual_interest_rate: 5,
        term_months: -6,
      },
    });
    const res = httpMocks.createResponse();

    for (let mw of loanValidator) {
      await runMiddleware(mw, req, res);
    }

    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData().errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ param: 'term_months' }),
      ])
    );
    done();
  });

  it('should fail when interestRate is 0', async (done) => {
    const req = httpMocks.createRequest({
      method: 'POST',
      body: {
        customer_id: 1,
        amount: 5000,
        annual_interest_rate: 0,
        term_months: 12,
      },
    });
    const res = httpMocks.createResponse();

    for (let mw of loanValidator) {
      await runMiddleware(mw, req, res);
    }

    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData().errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ param: 'annual_interest_rate' }),
      ])
    );
    done
  });
});
