const pool = require('../db/index.js');
const { calculateMonthlyRepayment } = require('../utils/loanCalculator.js');

// CREATE A NEW LOAN APPLICATION
const  createLoanApplication = async (req, res, next) => {

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const { customer_id, amount, annual_interest_rate, term_months } = req.body;

        // Basic validation
        if (!customer_id || !amount || !term_months || !annual_interest_rate) {
          return res.status(400).json({ error: 'Missing required fields' });
        }

        // Calculate the monthly repayment amount
        const monthly_repayment = calculateMonthlyRepayment(amount, annual_interest_rate, term_months);
        
        // Insert the loan application into the database
        const insertQuery = `
            INSERT INTO loan_applications 
                (customer_id, amount, annual_interest_rate, term_months, monthly_repayment, created_at)
            VALUES 
                ($1, $2, $3, $4, $5, $6) 
            RETURNING *`;
        const now = new Date();
        const values = [
        customer_id,
        amount, 
        term_months, 
        annual_interest_rate, 
        monthly_repayment,
        now
    ];
    
    const result = await client.query(insertQuery, values);
    await client.query('COMMIT');
    
    res.status(201).json({
      success: true,
      message: 'Loan application created successfully',
      data: result.rows[0]
    });
    } catch (error) {
        await client.query('ROLLBACK');
        next(error);
    } finally {
        client.release();
    }
};


/**
  Get loan application by ID with customer details
*/
const getLoanApplicationById = async (req, res, next) => {
    try {
      const { id } = req.params;
      
      // Join with customers table to get customer information
      const query = `
        SELECT 
          la.id, la.amount, la.term_months, la.annual_interest_rate, 
          la.monthly_repayment, la.created_at,
          c.id AS customer_id, c.name, c.email
        FROM 
          loan_applications la
        JOIN 
          customers c ON la.customer_id = c.id
        WHERE 
          la.id = $1
      `;
      
      const result = await pool.query(query, [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Loan application not found'
        });
      }
      
      // Format the response to organize customer info
      const loanApp = result.rows[0];
      const response = {
        id: loanApp.id,
        amount: loanApp.amount,
        term_months: loanApp.term_months,
        annual_interest_rate: loanApp.annual_interest_rate,
        monthly_repayment: loanApp.monthly_repayment,
        created_at: loanApp.created_at,
        customer: {
          id: loanApp.customer_id,
          name: loanApp.name,
          email: loanApp.email,
        }
      };
      
      res.status(200).json({
        success: true,
        data: response
      });
    } catch (error) {
      next(error);
    }
  };
  
/*
    Get all loan applications
*/
  const getAllLoanApplications = async (req, res, next) => {
    try {
      const query = `
        SELECT 
          la.id, la.customer_id, la.amount, la.term_months, 
          la.annual_interest_rate, la.monthly_repayment, la.created_at
        FROM 
          loan_applications la
        ORDER BY 
          la.created_at DESC
      `;
      
      const result = await pool.query(query);
      
      res.status(200).json({
        success: true,
        count: result.rows.length,
        data: result.rows
      });
    } catch (error) {
      next(error);
    }
  };
  
  module.exports = {
    createLoanApplication,
    getLoanApplicationById,
    getAllLoanApplications
  };