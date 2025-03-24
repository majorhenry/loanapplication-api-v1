const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');
// const { validateLoanApplication } = require('../middlewares/loanValidator');

// create a new loan application
router.post('/', loanController.createLoanApplication);

// Get loan application by ID
router.get('/:id', loanController.getLoanApplicationById);

// Get all loan applications
router.get('/', loanController.getAllLoanApplications);

module.exports = router;