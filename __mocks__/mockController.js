// Pretend controller for testing
const mockController = (req, res) => {
    return res.status(201).json({
      success: true,
      message: 'Loan application created successfully',
      data: req.body,
    });
  };
module.exports = { mockController };  