
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email varchar(150) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for fast lookups
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);


-- loan applications table
CREATE TABLE IF NOT EXISTS loan_applications (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  amount NUMERIC(16, 2) NOT NULL CHECK (amount > 0),
  term_months INTEGER NOT NULL CHECK (term_months > 0),
  annual_interest_rate DECIMAL(5, 2) NOT NULL CHECK (annual_interest_rate > 0),
  monthly_repayment DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_loan_application_customer_id ON loan_applications(customer_id);
CREATE INDEX IF NOT EXISTS idx_loan_application_created_at ON loan_applications(created_at);

-- Trigger to update the updated_at column when a row is updated
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';  

-- Add trigger to tables
CREATE TRIGGER update_customers_updated_at 
BEFORE UPDATE ON customers 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


CREATE TRIGGER update_loan_applications_updated_at 
BEFORE UPDATE ON loan_applications 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sampe data for testing
INSERT INTO customers (name, email) VALUES ('Jean Pantry', 'jean@gmail.com');
INSERT INTO customers (name, email) VALUES ('Stan tyson', 'stan@gmail.com');