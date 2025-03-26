const { body, validationResult } = require('express-validator');

const loanValidator = [
  body('amount').isFloat({ gt: 0 }).withMessage('Amount must be greater than 0'),
  body('interestRate').isFloat({ gt: 0 }).withMessage('Interest rate must be greater than 0'),
  body('months').isInt({ gt: 0 }).withMessage('Months must be greater than 0'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = { loanValidator };
