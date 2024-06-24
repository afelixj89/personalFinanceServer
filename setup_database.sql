-- Create the personal_finance database
CREATE DATABASE IF NOT EXISTS personal_finance;

-- Use the personal_finance database
USE personal_finance;

-- Create tables if needed (example structure)
-- You can modify or add more tables based on your application needs

-- Example table: financial_records
CREATE TABLE IF NOT EXISTS financial_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    category VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Add more table definitions here as needed