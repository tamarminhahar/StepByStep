import db from '../../DB/dbConnection.js';

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

export async function createMemorialEventsForUser(userId, dateOfLoss) {
  const base = new Date(dateOfLoss);
  const events = [];

  // פטירה
  events.push({
    title: 'תאריך הפטירה',
    date: new Date(base),
    type: 'אזכרה'
  });

  // שבעה
  for (let i = 0; i < 7; i++) {
    const d = new Date(base);
    d.setDate(d.getDate() + i);
    events.push({
      title: `שבעה - יום ${i + 1}`,
      date: d,
      type: 'שבעה'
    });
  }

  // שלושים
  const shloshim = new Date(base);
  shloshim.setDate(shloshim.getDate() + 29);
  events.push({
    title: 'סיום שלושים',
    date: shloshim,
    type: 'אזכרה'
  });

  // יארצייט
  const yahrzeit = new Date(base);
  yahrzeit.setFullYear(yahrzeit.getFullYear() + 1);
  events.push({
    title: 'יארצייט',
    date: yahrzeit,
    type: 'אזכרה'
  });

  for (const e of events) {
    const formatted = formatDate(e.date);
    await db.query(`
      INSERT INTO calendar_events
        (calendar_type, user_id, title, start_date, end_date, event_type, description, color, apply_to_all, locked)
      VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      'bereaved',
      userId,
      e.title,
      formatted,
      formatted,
      e.type,
      e.description ?? '', 
      '#808080',
      false,
      true
    ]);
  }
}
