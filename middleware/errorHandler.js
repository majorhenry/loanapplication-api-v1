// Central error handling middleware
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    
    // Determine error status and message
    const status = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    
    // Handle specific types of errors
    if (err.code === '23505') {
      // PostgreSQL unique constraint violation
      return res.status(409).json({
        success: false,
        message: 'A resource with these details already exists'
      });
    }
    
    if (err.code === '22P02') {
      // PostgreSQL invalid input syntax 
      return res.status(400).json({
        success: false,
        message: 'Invalid input value'
      });
    }
    
    // Default error response
    res.status(status).json({
      success: false,
      message: message,
    });
  };
  
  module.exports = errorHandler;