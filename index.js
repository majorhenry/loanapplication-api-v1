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
app.use(express.json());

// Routes
app.use('/api/loans-applications', loanRoutes);
app.use('/api/customers', customerRoutes);


// Error handling middleware
app.use(errorHandler);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});


module.exports = app;
