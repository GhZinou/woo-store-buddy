
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

    // Create tables if they don't exist
    await initDatabase();

    return connection;
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
}

// Initialize database with required tables
async function initDatabase() {
  try {
    // Create users table if it doesn't exist
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        store_url VARCHAR(255),
        ck TEXT,
        cs TEXT,
        expiration_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
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
