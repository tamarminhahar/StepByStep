import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();
console.log('env vars:', {
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
});
const db = await mysql.createPool({

    host:'127.0.0.1',
    user:  'root',
    password: process.env.DB_PASSWORD || '327880845',
    database:'grief_support', 
    multipleStatements: true 
  });

  
  console.log(`Connected to database$`);

export default db;
