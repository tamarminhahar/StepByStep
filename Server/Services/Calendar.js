
import db from '../../DB/dbConnection.js';

export async function createEvent(eventData) {
    const [result] = await db.query(`
        INSERT INTO calendar_events
        (calendar_type, user_id, created_by_supporter_id, title, start_date, end_date, event_type, description, color, apply_to_all)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
        eventData.calendar_type,
        eventData.user_id || null,
        eventData.created_by_supporter_id || null,
        eventData.title,
        eventData.start_date,
        eventData.end_date,
        eventData.event_type,
        eventData.description || '',
        eventData.color,
        eventData.apply_to_all || false
    ]);

    return result.insertId;
}

export async function updateEvent(eventId, eventData) {
    await db.query(`
        UPDATE calendar_events
        SET title = ?, start_date = ?, end_date = ?, event_type = ?, description = ?, color = ?
        WHERE id = ?
    `, [
        eventData.title,
        eventData.start_date,
        eventData.end_date,
        eventData.event_type,
        eventData.description,
        eventData.color,
        eventId
    ]);
}

export async function deleteEvent(eventId) {
    await db.query(`DELETE FROM calendar_events WHERE id = ?`, [eventId]);
}

export async function getEventsForUser(userId) {
    const [rows] = await db.query(`
        SELECT * FROM calendar_events
        WHERE
            (calendar_type = 'supporter' AND apply_to_all = true)
            OR
            (calendar_type = 'bereaved' AND user_id = ?)
    `, [userId]);

    return rows;
}

export async function getEventById(eventId) {
    const [rows] = await db.query(`SELECT * FROM calendar_events WHERE id = ?`, [eventId]);
    return rows[0];
}

// export async function updateParticipationStatus(eventId, status) {
//   const [result] = await db.query(
//     'UPDATE calendar_events SET participation_status = ? WHERE id = ?',
//     [status, eventId]
//   );
//   return result;
// }
// export async function hasUserParticipated(eventId, userId) {
//   const [rows] = await db.query(
//     'SELECT 1 FROM event_participation WHERE event_id = ? AND user_id = ?',
//     [eventId, userId]
//   );
//   return rows.length > 0;
// }
// export async function addParticipant(eventId, userId) {
//   await db.query(
//     'INSERT IGNORE INTO event_participation (event_id, user_id) VALUES (?, ?)',
//     [eventId, userId]
//   );
// }

export async function hasUserParticipated(eventId, userId) {
  const [rows] = await db.query(
    'SELECT 1 FROM event_participation WHERE event_id = ? AND user_id = ?',
    [eventId, userId]
  );
  return rows.length > 0;
}
// 🔎 בודק אם המשתמש כבר השתתף באירוע – כדי למנוע כפילויות
export async function addParticipant(eventId, userId) {
  await db.query(
    'INSERT IGNORE INTO event_participation (event_id, user_id) VALUES (?, ?)',
    [eventId, userId]
  );
}


