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

     host:process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD ,
     database: process.env.DB_NAME, 
    multipleStatements: true 
  });
 
  console.log(`Connected to database$`);

export default db;
