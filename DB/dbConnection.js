import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Function to create and return a database connection pool
let db;

try {
  db = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 3000,
    database: process.env.DB_NAME || 'grief_support',
    multipleStatements: true
  });

  // Optional: test the connection
  const connection = await db.getConnection();
  console.log(' Connected to MySQL as:', process.env.DB_USER);
  connection.release();
} catch (error) {
  console.error(' Failed to connect to MySQL:', error.message);
}

export default db;
