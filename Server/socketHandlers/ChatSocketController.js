import { createNotification } from '../Services/Notification.js';
import { updateOnlineStatus, getOrCreateSession, saveMessageToDB, savePendingMessageIfNeeded } from '../Services/Chat.js';
import { sendNotificationToUser } from './NotificationSocketController.js';
import db from '../../DB/dbConnection.js';
const userSockets = new Map();
const userCurrentSessions = new Map();

export async function handleSocketConnection(io, socket) {
  
  await updateOnlineStatus(socket.userId, true);
  userSockets.set(socket.userId, socket.id);

  socket.on('user_in_chat', ({ sessionId }) => {
    userCurrentSessions.set(socket.userId, sessionId);
  });

  socket.on('user_left_chat', () => {
    userCurrentSessions.delete(socket.userId);
  });

    socket.on('disconnect', async () => {
    await updateOnlineStatus(socket.userId, false);
    userSockets.delete(socket.userId); // ⬅️ חובה להסיר מהמפה
    userCurrentSessions.delete(socket.userId);
  });

  socket.on('start_chat', async ({ otherUserId, isAnonymous }, callback) => {
    try {
      const sessionId = await getOrCreateSession(socket.userId, otherUserId, isAnonymous);
      socket.join(sessionId);
      callback({ sessionId });
      userCurrentSessions.set(socket.userId, sessionId);
    } catch (err) {
      callback({ error: err.message });
    }
  });

  // socket.on('send_message', async ({ sessionId, message }) => {
  //   const messageId = await saveMessageToDB(sessionId, socket.userId, message);
  //   await savePendingMessageIfNeeded(socket, sessionId, message, io);

  //   const [rows] = await db.query(`
  //   SELECT user1_id, user2_id 
  //   FROM chat_sessions 
  //   WHERE id = ?
  // `, [sessionId]);
  //   if (!rows.length) return;

  //   const session = rows[0];
  //   const recipientId = session.user1_id === socket.userId ? session.user2_id : session.user1_id;

  //   // בדיקה האם הנמען מחובר וב-session הזה
  //   const isOnline = userSockets.has(recipientId);
  //   const activeSession = userCurrentSessions.get(recipientId);
  //   const isInSameChat = activeSession === sessionId;

  //   // שליחת התראה רק אם הוא לא באותו הצ'אט
  //   if (!isOnline || !isInSameChat) {
  //     const [user] = await db.query(`SELECT user_name FROM users WHERE id = ?`, [socket.userId]);
  //     const senderName = user[0]?.user_name || 'משתמש';

  //     await createNotification({
  //       user_id: recipientId,
  //       type: 'new_chat_message',
  //       message: `${senderName} שלח/ה לך הודעה חדשה בצ'אט`,
  //       target_url: `/chat/${socket.userId}`
  //     });

  //     sendNotificationToUser(io, recipientId);
  //   }

  //   io.to(sessionId).emit('receive_message', {
  //     id: messageId,
  //     sessionId,
  //     senderId: socket.userId,
  //     message,
  //     timestamp: new Date().toISOString(),
  //     seenAt: null
  //   });
  // });
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

    // בדיקה האם הנמען מחובר וב-session הזה
    const isOnline = userSockets.has(recipientId);
    const activeSession = userCurrentSessions.get(recipientId);
    const isInSameChat = activeSession === sessionId;

    // שליחת התראה רק אם הוא לא באותו הצ'אט
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

    // שליחה לשני הצדדים – הנמען (room) והשולח
    io.to(sessionId).emit('receive_message', payload);
    socket.emit('receive_message', payload); // שליחה ישירה לשולח
  });

  socket.on('register user', () => {
    userSockets.set(socket.userId, socket.id);
  });

  socket.on('message seen', async ({ messageId }) => {
    try {
      await db.query(`UPDATE chat_messages SET seen_at = NOW() WHERE id = ?`, [messageId]);

      await db.query(`
      DELETE FROM pending_messages 
      WHERE message = (SELECT message FROM chat_messages WHERE id = ?) 
      AND receiver_id = ?
    `, [messageId, socket.userId]);
      io.emit('message seen confirmation', { messageId });
    } catch (err) {
      console.error(' Failed to update seen_at or delete pending message:', err);
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

