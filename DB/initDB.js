
import { connectToDatabase } from './dbConnection.js';

async function initDatabase() {
  const con = await connectToDatabase();
  await con.query(`CREATE DATABASE IF NOT EXISTS grief_support;`);
  await con.end();

  const dbCon = await connectToDatabase('grief_support');

await dbCon.query(`SET FOREIGN_KEY_CHECKS = 0;`);

await dbCon.query(`DROP TABLE IF EXISTS mentor_profiles;`);
await dbCon.query(`DROP TABLE IF EXISTS bereaved_profile;`);
await dbCon.query(`DROP TABLE IF EXISTS supporter_profile;`);
await dbCon.query(`DROP TABLE IF EXISTS users;`);

await dbCon.query(`SET FOREIGN_KEY_CHECKS = 1;`);



  // // Create users table
  // await dbCon.query(`
  //   CREATE TABLE users (
  //     id INT AUTO_INCREMENT PRIMARY KEY,
  //     user_name VARCHAR(20) UNIQUE NOT NULL,
  //     email VARCHAR(20) UNIQUE NOT NULL,
  //     password_hash VARCHAR(255) NOT NULL,
  //     role ENUM('bereaved', 'Supporter', 'admin') NOT NULL
  //   );
  // `);

  // // Create bereaved_profile table
  // await dbCon.query(`
  //   CREATE TABLE bereaved_profile (
  //     id INT AUTO_INCREMENT PRIMARY KEY,
  //     user_id INT NOT NULL,
  //     date_of_loss DATE NOT NULL,
  //     relationship_to_deceased ENUM('Parent', 'Sibling', 'Spouse', 'Child', 'Friend', 'Grandparent', 'In-Law', 'Cousin', 'Distant Relative') NOT NULL,
  //     FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  //   );
  // `);

  // // Create Supporter_profile table
  // await dbCon.query(`
  //   CREATE TABLE Supporter_profile (
  //     id INT AUTO_INCREMENT PRIMARY KEY,
  //     user_id INT NOT NULL,
  //     Supporter ENUM('Social Worker', 'Psychologist', 'Bereaved Person (at least 10 years)') NOT NULL,
  //     FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  //   );
  // `);
await dbCon.query(`
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_name VARCHAR(20) UNIQUE NOT NULL,
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
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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
`);
console.log('Tables created!');
await dbCon.end();
}

initDatabase();
// CREATE TABLE post_follows (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   user_id INT NOT NULL,
//   post_id INT NOT NULL,
//   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//   UNIQUE (user_id, post_id),
//   FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
//   FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
// );

// CREATE TABLE notifications (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     user_id INT NOT NULL,
//     post_id INT NOT NULL,
//     message TEXT NOT NULL,
//     is_read BOOLEAN DEFAULT FALSE,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
//     FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
// );