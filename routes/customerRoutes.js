const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
// const { validateLoanApplication } = require('../middlewares/loanValidator');

// create a new loan application
router.post('/', customerController.createCustomer);

// Get loan application by ID
router.get('/:id', customerController.getCustomerById);

// Get all loan applications
// router.get('/', loanController.getAllLoanApplications);

module.exports = router;