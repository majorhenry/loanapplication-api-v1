const app = require('./index.js');
const pool = require('./db/index.js');
const dotenv = require('dotenv');
const retry = require('async-retry');
dotenv.config();

const port = process.env.PORT || 4000; 
const startServer = async () => {
  try {
    await retry(async () => {
      const client = await pool.connect();
      console.log('Connected to the database successfully!');
      app.listen(process.env.PORT || 3001, () => {
        console.log(`Starting server on port ${port}...`);
    });
      client.release();
    }, {
      retries: 5,
      minTimeout: 2000, 
    });
  } catch (error){
    console.error('Error connecting to the database', error);
    process.exit(1); // exits the process if the connection fails after retries
  }
}   

startServer();