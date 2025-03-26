const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const retry = require('async-retry');
const dotenv =  require('dotenv');
const pool = require('./db/index.js');
const loanRoutes = require('./routes/loanRoutes.js');
const customerRoutes = require('./routes/customerRoutes.js');
const errorHandler = require('./middleware/errorHandler.js');

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;  

// Security middleware
app.use(helmet()); // set security-related HTTP headers
app.use(cors()); // enable CORS
app.use(morgan('common')); // log HTTP requests

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Parse application/json requests
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/loans-applications', loanRoutes);
app.use('/api/customers', customerRoutes);


// Error handling middleware
app.use(errorHandler);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

const startServer = async () => {
  try {
    await retry(async () => {
      const client = await pool.connect();
      console.log('Connected to the database successfully!');
      client.release();
    }, {
      retries: 5,
      minTimeout: 2000, // 2 seconds
    });
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error){
    console.error('Error connecting to the database', error);
    process.exit(1); // exit the process if the connection fails after retries
  }
}   
module.exports = app;
startServer();
