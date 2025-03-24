const pool = require('../db');
const { body, validationResult } = require('express-validator');

/**
 Create a new customer
 */
exports.createCustomer = [
  // Validate input
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),

  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email } = req.body;

    try {
      // Insert into DB
      const result = await pool.query(
        'INSERT INTO customers (name, email) VALUES ($1, $2) RETURNING id',
        [name, email]
      );

      res.status(201).json({ message: 'Customer created', customer_id: result.rows[0].id });
    } catch (error) {
      console.error('Error creating customer:', error.message);
      res.status(500).json({ error: 'Failed to create customer' });
    }
  }
];

/*
 ROUTE: GET /customers/:id
 */
exports.getCustomerById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'SELECT id, name, email FROM customers WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error retrieving customer:', error.message);
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
};
