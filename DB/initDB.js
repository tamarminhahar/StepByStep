
import mysql from 'mysql2/promise';
import db from './dbConnection.js';

async function initDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    multipleStatements: true,
  });

  await connection.query(`CREATE DATABASE IF NOT EXISTS grief_support;`);
  console.log('Database grief_support created or already exists.');
  await connection.end();
  await db.query(`SET FOREIGN_KEY_CHECKS = 0;`);

  await db.query(`
  DROP TABLE IF EXISTS 
  notifications,
    pending_messages,
    chat_messages,
    chat_invitations,
    chat_sessions,
    calendar_events,
    comments,
    likes,
    posts,
    supporter_profile,
    bereaved_profile,
    passwords,
    users,
    event_participation;
`);

  await db.query(`SET FOREIGN_KEY_CHECKS = 1;`);

  await db.query(`
    CREATE TABLE users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_name VARCHAR(20) UNIQUE NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      role ENUM('bereaved', 'supporter') NOT NULL,
      is_online BOOLEAN DEFAULT FALSE
    );

    CREATE TABLE passwords (
    user_id INT PRIMARY KEY,
    password_hash VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

    CREATE TABLE bereaved_profile (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      date_of_loss DATE NOT NULL,
      relationship_to_deceased ENUM(   'הורה',
    'אח/ות',
    'בן/בת זוג',
    'ילד/ה',
    'חבר/ה',
    'סבא/סבתא',
    'קרוב משפחה רחוק'
  ) NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE supporter_profile (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      profession_type  ENUM( 'עובד/ת סוציאלית',
  'פסיכולוג/ית',
  'אדם שכול (מעל 10 שנים)') NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE posts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      title VARCHAR(255) NOT NULL,
      body TEXT NOT NULL,
      media_url VARCHAR(500),
      post_type ENUM('שאלה', 'זיכרון', 'טיפ', 'שיתוף', 'המלצה', 'אחר') NOT NULL,
      poster_status_type ENUM('bereaved', 'supporter') NOT NULL,
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
      anonymous BOOLEAN DEFAULT FALSE,
      FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

  CREATE TABLE calendar_events (
    id INT AUTO_INCREMENT PRIMARY KEY,  
    calendar_type ENUM('supporter', 'bereaved') NOT NULL,
    user_id INT,
    created_by_supporter_id INT,  
    title VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE ,
    event_type VARCHAR(50),
    description TEXT,
    color VARCHAR(20) ,
    apply_to_all BOOLEAN DEFAULT FALSE,
    locked BOOLEAN DEFAULT FALSE, 
    participation_status ENUM('confirmed', 'declined') DEFAULT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by_supporter_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE event_participation (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_id INT NOT NULL,
  user_id INT NOT NULL,
  responded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (event_id, user_id),
  FOREIGN KEY (event_id) REFERENCES calendar_events(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  type VARCHAR(30) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  target_url VARCHAR(255),
  is_read BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE chat_sessions (
  id VARCHAR(255) PRIMARY KEY,
  user1_id INT NOT NULL,
  user2_id INT NOT NULL,
  is_anonymous BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user1_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (user2_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE chat_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  session_id VARCHAR(255) NOT NULL,
  sender_id INT NOT NULL,
  message TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  seen_at TIMESTAMP NULL,
  is_deleted BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (session_id) REFERENCES chat_sessions(id) ON DELETE CASCADE,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE pending_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  session_id VARCHAR(255) NOT NULL,
  sender_id INT NOT NULL,
  receiver_id INT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_read BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (session_id) REFERENCES chat_sessions(id) ON DELETE CASCADE,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_user1 ON chat_sessions(user1_id);
CREATE INDEX idx_user2 ON chat_sessions(user2_id);

CREATE INDEX idx_session_id ON chat_messages(session_id);
CREATE INDEX idx_seen_at ON chat_messages(seen_at);

CREATE INDEX idx_receiver_id ON pending_messages(receiver_id);
CREATE INDEX idx_is_read ON pending_messages(is_read);

CREATE UNIQUE INDEX idx_username ON users(user_name);
CREATE UNIQUE INDEX idx_email ON users(email);

CREATE INDEX idx_user_id ON posts(user_id);
CREATE INDEX idx_post_type ON posts(post_type);

CREATE INDEX idx_post_likes ON likes(post_id);

CREATE INDEX idx_post_comments ON comments(post_id);
  `);

  console.log('Tables created!');
}

initDatabase().catch(err => {
  console.error('Error initializing database:', err);
});
