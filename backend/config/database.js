
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
};

let connection = null;

// Connect to the database
async function connectToDatabase() {
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected to MySQL database');

    // Create tables if they don't exist and update schema
    await initDatabase();

    return connection;
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
}

// Initialize database with required tables and ensure schema is up-to-date
async function initDatabase() {
  try {
    // Create users table if it doesn't exist, now including the 'name' column
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NULL,  -- Added name column
        store_url VARCHAR(255),
        ck TEXT,
        cs TEXT,
        expiration_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Check if 'name' column exists and add it if it doesn't (for existing tables)
    const [columns] = await connection.execute(
      `SELECT COLUMN_NAME
       FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users' AND COLUMN_NAME = 'name'`,
      [dbConfig.database]
    );

    if (columns.length === 0) {
      console.log("Adding 'name' column to existing 'users' table.");
      await connection.execute('ALTER TABLE users ADD COLUMN name VARCHAR(255) NULL AFTER password');
    }

    console.log('Database initialized/updated successfully');
  } catch (error) {
    console.error('Database initialization/update failed:', error);
    throw error;
  }
}

// Get database connection
function getConnection() {
  if (!connection) {
    throw new Error('Database not connected');
  }
  return connection;
}

module.exports = {
  connectToDatabase,
  getConnection,
};

