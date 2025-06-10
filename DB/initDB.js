
import mysql from 'mysql2/promise';
import db from './dbConnection.js';

async function initDatabase() {
  // First, create the database if it doesn't exist:
  const connection = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: process.env.DB_PASSWORD || 'chavak1017',
    multipleStatements: true,
  });

  await connection.query(`CREATE DATABASE IF NOT EXISTS grief_support;`);
  console.log('Database grief_support created or already exists.');
  await connection.end();

  // Now use the existing db pool (which is connected to grief_support):
  await db.query(`SET FOREIGN_KEY_CHECKS = 0;`);

  await db.query(`DROP TABLE IF EXISTS mentor_profiles;`);
  await db.query(`DROP TABLE IF EXISTS bereaved_profile;`);
  await db.query(`DROP TABLE IF EXISTS supporter_profile;`);
  await db.query(`DROP TABLE IF EXISTS posts;`);
  await db.query(`DROP TABLE IF EXISTS likes;`);
  await db.query(`DROP TABLE IF EXISTS comments;`);
  await db.query(`DROP TABLE IF EXISTS users;`);
await db.query(`DROP TABLE IF EXISTS base_calendar;`);
await db.query(`DROP TABLE IF EXISTS bereaved_calendar;`);
await db.query(`DROP TABLE IF EXISTS supporter_calendar;`);

  await db.query(`SET FOREIGN_KEY_CHECKS = 1;`);

  // Create tables:
  await db.query(`
    CREATE TABLE users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_name VARCHAR(20) UNIQUE NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
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

    CREATE TABLE supporter_profile (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      profession_type  ENUM('Social Worker', 'Psychologist', 'Bereaved Person (at least 10 years)') NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE posts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      title VARCHAR(255) NOT NULL,
      body TEXT NOT NULL,
      media_url VARCHAR(500),
      grief_tag ENUM('Parent', 'Sibling', 'Spouse', 'Child', 'Friend', 'Grandparent', 'In-Law', 'Cousin', 'Distant Relative', 'Other') NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE likes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      post_id INT NOT NULL,
     UNIQUE (user_id, post_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
    );

    CREATE TABLE comments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      post_id INT NOT NULL,
      user_id INT NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE base_calendar (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bereaved_profile_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATETIME NOT NULL,
    end_date DATETIME,
    FOREIGN KEY (bereaved_profile_id) REFERENCES bereaved_profile(id)
);
CREATE TABLE supporter_calendar (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATETIME NOT NULL,
    end_date DATETIME,
    created_by_supporter_id INT NOT NULL,
    FOREIGN KEY (created_by_supporter_id) REFERENCES users(id)
);

CREATE TABLE bereaved_calendar (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATETIME NOT NULL,
    end_date DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id)
);


  `);

  console.log('Tables created!');
}

initDatabase().catch(err => {
  console.error('Error initializing database:', err);
});

    //     CREATE TABLE IF NOT EXISTS passwords (
    //   user_id INT PRIMARY KEY,
    //   password_hash VARCHAR(255) NOT NULL,
    //   FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    // );