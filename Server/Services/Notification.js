import db from '../../DB/dbConnection.js';

export async function getNotificationsForUser(userId) {
    const [rows] = await db.query(`
        SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC
    `, [userId]);
    return rows;
}



export async function createNotification({ user_id, type, message, target_url }) {
    await db.query(`
        INSERT INTO notifications (user_id, type, message, target_url)
        VALUES (?, ?, ?, ?)
    `, [user_id, type, message, target_url]);
}

export async function markAsRead(notificationId, userId) {
    await db.query(`
        UPDATE notifications SET is_read = TRUE  WHERE id = ? AND user_id = ?
    `, [notificationId, userId]);
}
export async function markAllAsRead(userId) {
    await db.query(`
        UPDATE notifications SET is_read = TRUE  WHERE user_id = ?
    `, [userId]);
}

