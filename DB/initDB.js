// import { connectToDatabase } from './dbConnection.js';
import db from './dbConnection.js';


async function initDatabase() {


  await db.query(`CREATE DATABASE IF NOT EXISTS grief_support;`);

  // await db.end();

  await db.query(`USE grief_support;`);

  await db.query(`
      DROP TABLE IF EXISTS bereaved_profile;
  DROP TABLE IF EXISTS supporter_profile;
  DROP TABLE IF EXISTS users;
     
    CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_name VARCHAR(20)UNIQUE NOT NULL,
  email VARCHAR(20) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('bereaved', 'supporter', 'admin') NOT NULL
);

CREATE TABLE bereaved_profile (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  date_of_loss DATE NOT NULL,
   relationship_to_deceased ENUM('Parent', 'Sibling', 'Spouse', 'Child', 'Friend', 'Grandparent', 'In-Law', 'Cousin', 'Distant Relative') NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE Supporter_profile (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  Supporter ENUM('Social Worker', 'Psychologist', 'Bereaved Person (at least 10 years)') NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);`  
  );

  console.log('Tables created!');
  await db.end();
}

initDatabase();
