import { createNotification } from '../Services/Notification.js';
import { updateOnlineStatus, getOrCreateSession, saveMessageToDB, savePendingMessageIfNeeded } from '../Services/Chat.js';
import { sendNotificationToUser } from './NotificationSocketController.js';
import db from '../../DB/dbConnection.js';
const userSockets = new Map();
const userCurrentSessions = new Map();

export async function handleSocketConnection(io, socket) {
  await updateOnlineStatus(socket.userId, true);
  io.emit('user_status_change', { userId: socket.userId, isOnline: true });
  userSockets.set(socket.userId, socket.id);

  socket.on('user_in_chat', ({ sessionId }) => {
    userCurrentSessions.set(socket.userId, sessionId);
  });

  socket.on('user_left_chat', () => {
    userCurrentSessions.delete(socket.userId);
  });

  socket.on('disconnect', async () => {
    await updateOnlineStatus(socket.userId, false);
    io.emit('user_status_change', { userId: socket.userId, isOnline: false });
    userSockets.delete(socket.userId); 
    userCurrentSessions.delete(socket.userId);
  });

  socket.on('start_chat', async ({ otherUserId, isAnonymous }, callback) => {
    try {
      const sessionId = await getOrCreateSession(socket.userId, otherUserId, isAnonymous);
      socket.join(sessionId);
      const [historyRows] = await db.query(`
  SELECT id, sender_id AS senderId, message, seen_at AS seenAt, is_deleted AS isDeleted
  FROM chat_messages
  WHERE session_id = ?
  ORDER BY timestamp ASC
`, [sessionId]);
      const mappedHistory = historyRows.map(msg => ({
        id: msg.id,
        senderId: msg.senderId,
        message: msg.isDeleted ? 'ההודעה נמחקה' : msg.message,
        seenAt: msg.seenAt,
        deleted: !!msg.isDeleted
      }));
      callback({ sessionId, history: mappedHistory });
      userCurrentSessions.set(socket.userId, sessionId);
    } catch (err) {
      callback({ error: err.message });
    }
  });

  socket.on('send_message', async ({ sessionId, message }) => {
    const messageId = await saveMessageToDB(sessionId, socket.userId, message);
    await savePendingMessageIfNeeded(socket, sessionId, message, io);
    const [rows] = await db.query(`
      SELECT user1_id, user2_id 
      FROM chat_sessions 
      WHERE id = ?
    `, [sessionId]);
    if (!rows.length) return;
    const session = rows[0];
    const recipientId = session.user1_id === socket.userId ? session.user2_id : session.user1_id;
    const isOnline = userSockets.has(recipientId);
    const activeSession = userCurrentSessions.get(recipientId);
    const isInSameChat = activeSession === sessionId;
    if (!isOnline || !isInSameChat) {
      const [user] = await db.query(`SELECT user_name FROM users WHERE id = ?`, [socket.userId]);
      const senderName = user[0]?.user_name || 'משתמש';
      await createNotification({
        user_id: recipientId,
        type: 'new_chat_message',
        message: `${senderName} שלח/ה לך הודעה חדשה בצ'אט`,
        target_url: `/chat/session/${senderName}`
      });
      sendNotificationToUser(io, recipientId);
    }
    const payload = {
      id: messageId,
      sessionId,
      senderId: socket.userId,
      message,
      timestamp: new Date().toISOString(),
      seenAt: null
    };
    io.to(sessionId).emit('receive_message', payload);
    socket.emit('receive_message', payload); // שליחה ישירה לשולח
  });

  socket.on('register user', () => {
    userSockets.set(socket.userId, socket.id);
  });

  // socket.on('message seen', async ({ messageId }) => {
  //   try {
  //     await db.query(`UPDATE chat_messages SET seen_at = NOW() WHERE id = ?`, [messageId]);

  //     await db.query(`
  //     DELETE FROM pending_messages 
  //     WHERE message = (SELECT message FROM chat_messages WHERE id = ?) 
  //     AND receiver_id = ?
  //   `, [messageId, socket.userId]);
  //     io.emit('message seen confirmation', { messageId });
  //   } catch (err) {
  //     console.error(' Failed to update seen_at or delete pending message:', err);
  //   }
  // });
socket.on('message seen', async ({ messageId }) => {
  try {
    // עדכון השדה seen_at בבסיס הנתונים
    await db.query(`UPDATE chat_messages SET seen_at = NOW() WHERE id = ?`, [messageId]);

    // מחיקת ההודעה מרשימת הודעות ממתינות אם קיימת
    await db.query(`
      DELETE FROM pending_messages 
      WHERE message = (SELECT message FROM chat_messages WHERE id = ?) 
      AND receiver_id = ?
    `, [messageId, socket.userId]);

    // שליפת שני המשתמשים מהשיחה לפי messageId
    const [sessionRows] = await db.query(`
      SELECT cs.user1_id, cs.user2_id 
      FROM chat_sessions cs
      JOIN chat_messages cm ON cm.session_id = cs.id
      WHERE cm.id = ?
    `, [messageId]);

    if (!sessionRows.length) return;

    const session = sessionRows[0];
    const recipient1 = session.user1_id;
    const recipient2 = session.user2_id;

    // שליחה של אישור ראיה רק לשני המשתמשים הרלוונטיים
    [recipient1, recipient2].forEach(userId => {
      const socketId = userSockets.get(userId);
      if (socketId) {
        io.to(socketId).emit('message seen confirmation', { messageId });
      }
    });
  } catch (err) {
    console.error('Failed to update seen_at or delete pending message:', err);
  }
});

  socket.on('user_online', ({ sessionId }) => {
    socket.to(sessionId).emit('user_online', { userId: socket.userId });
  });

  socket.on('user_in_chat', ({ sessionId }) => {
    userCurrentSessions.set(socket.userId, sessionId);
  });

  socket.on('user_typing', ({ sessionId, userName }) => {
    socket.to(sessionId).emit('user_typing', {
      userId: socket.userId,
      userName
    });
  });

  socket.on('user_stopped_typing', ({ sessionId }) => {
    socket.to(sessionId).emit('user_stopped_typing', {
      userId: socket.userId
    });
  });

  socket.on('delete_message', async ({ messageId }) => {
    try {
      await db.query(`
      UPDATE chat_messages
      SET message = '', is_deleted = TRUE
      WHERE id = ? AND sender_id = ?
    `, [messageId, socket.userId]);

      io.emit('message_deleted', { messageId });
    } catch (err) {
      console.error('Failed to mark message as deleted:', err);
    }
  });
}

