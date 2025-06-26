import db from '../../DB/dbConnection.js';
import { v4 as uuidv4 } from 'uuid';

export async function isUserInChat(sessionId, userId) {
  const [sessions] = await db.query(`
    SELECT * FROM chat_sessions 
    WHERE id = ? AND (user1_id = ? OR user2_id = ?)
  `, [sessionId, userId, userId]);

  return sessions.length > 0;
}

export async function updateOnlineStatus(userId, isOnline) {
  await db.query(`UPDATE users SET is_online = ? WHERE id = ?`, [isOnline, userId]);
}

export async function getOrCreateSession(user1Id, user2Id) {
  if (user1Id === user2Id) {
    throw new Error("Can't start a chat with yourself");
  }

  const [[user2]] = await db.query(`SELECT id FROM users WHERE id = ?`, [user2Id]);
  if (!user2) {
    throw new Error("User not found");
  }

  const [rows] = await db.query(`
    SELECT id FROM chat_sessions
    WHERE (user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?)
  `, [user1Id, user2Id, user2Id, user1Id]);

  if (rows.length > 0) return rows[0].id;

  const id = uuidv4();
  await db.query(`
    INSERT INTO chat_sessions (id, user1_id, user2_id)
    VALUES (?, ?, ?)
  `, [id, user1Id, user2Id]);

  return id;
}

export async function saveMessageToDB(sessionId, senderId, message) {
  const [result] = await db.query(`
    INSERT INTO chat_messages (session_id, sender_id, message)
    VALUES (?, ?, ?)
  `, [sessionId, senderId, message]);

  return result.insertId;
}


export async function savePendingMessageIfNeeded(socket, sessionId, message, io) {
  try {
    const [rows] = await db.query(`
      SELECT user1_id, user2_id
      FROM chat_sessions
      WHERE id = ?
    `, [sessionId]);

    if (!rows || rows.length === 0) return;

    const row = rows[0];
    const receiverId = (row.user1_id === socket.userId) ? row.user2_id : row.user1_id;

    const isReceiverOnline = Array.from(io.sockets.sockets.values())
      .some(s => s.userId === receiverId);

    if (!isReceiverOnline) {
      await db.query(`
  INSERT INTO pending_messages (session_id, sender_id, receiver_id, message)
  VALUES (?, ?, ?, ?)
`, [sessionId, socket.userId, receiverId, message]);

    }
  } catch (err) {
    console.error('savePendingMessageIfNeeded error:', err.message);
  }
}
export async function getMessagesBySession(sessionId) {
  const [messages] = await db.query(`
    SELECT 
      id,
      sender_id AS senderId,
      message,
      timestamp,
      seen_at AS seenAt,
      is_deleted AS deleted
    FROM chat_messages
    WHERE session_id = ?
    ORDER BY timestamp ASC
  `, [sessionId]);

  return messages.map(msg => ({
    ...msg,
    message: msg.deleted ? 'ההודעה נמחקה' : msg.message
  }));
}


export async function fetchPendingMessages(userId) {
  const [rows] = await db.query(`
    SELECT id, sender_id, message, created_at
    FROM pending_messages
    WHERE receiver_id = ?
    ORDER BY created_at DESC
  `, [userId]);

  return rows;
}
