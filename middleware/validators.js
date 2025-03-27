// const { body, validationResult } = require('express-validator');

// const loanValidator = [
//   body('amount').isFloat({ gt: 0 }).withMessage('Amount must be greater than 0'),
//   body('annual_interest_rate').isFloat({ gt: 0 }).withMessage('Interest rate must be greater than 0'),
//   body('term_months').isInt({ gt: 0 }).withMessage('Months must be greater than 0'),
//   (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     next();
//   },
// ];

// module.exports = { loanValidator };
// ___
const { body, validationResult } = require('express-validator');

const loanApplicationValidationRules = [
  // Amount validation
  body('amount')
    .exists().withMessage('Loan amount is required')
    .isFloat({ min: 0 }).withMessage('Loan amount must be a positive number'),

  // Term months validation  
  body('term_months')
    .exists().withMessage('Loan term is required')
    .isInt({ min: 1 }).withMessage('Loan term must be a positive integer'),

  // Interest rate validation
  body('annual_interest_rate')
    .exists().withMessage('Annual interest rate is required')
    .isFloat({ min: 0.001 }).withMessage('Annual interest rate must be greater than zero'),

  // Middleware to check validation results
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = loanApplicationValidationRules;
// const { body, validationResult } = require('express-validator');

// // Loan application validation middleware
// const loanValidationMiddleware = [
//   // Validate loan amount
//   body('amount')
//     .exists().withMessage('Loan amount is required')
//     .isFloat({ min: 0.01 }).withMessage('Loan amount must be a positive number'),
  
//   // Validate loan term in months
//   body('term_months')
//     .exists().withMessage('Loan term is required')
//     .isInt({ min: 1 }).withMessage('Loan term must be a positive integer'),
  
//   // Validate annual interest rate
//   body('annual_interest_rate')
//     .exists().withMessage('Annual interest rate is required')
//     .isFloat({ min: 0.01, max: 100 }).withMessage('Annual interest rate must be a positive number between 0.01 and 100'),
  
//   // Middleware to check validation results
//   (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     next();
//   }
// ];

// module.exports = loanValidationMiddleware;
