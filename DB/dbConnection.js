import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();
// export async function connectToDatabase(database = null) {
const db = await mysql.createPool({

  // const connection = await mysql.createConnection({
    host:'127.0.0.1',
    user:  'root',
    password: process.env.DB_PASSWORD || 'chavak1017',
    database:'grief_support', 
    multipleStatements: true 
  });

  console.log(`Connected to database$`);

export default db;

// const con = await connectToDatabase();
// export default con;