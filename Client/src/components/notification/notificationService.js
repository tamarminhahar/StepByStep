

const API_BASE = 'http://localhost:3000/api/notification';

export async function fetchNotifications() {
  try {
    const res = await fetch(`${API_BASE}`, {
      credentials: 'include',
    });

    if (!res.ok) {
      const errMsg = await res.text();
      throw new Error(`שגיאה בשרת (${res.status}): ${errMsg}`);
    }

    const data = await res.json();

    if (!Array.isArray(data)) {
      throw new Error('מבנה תגובה לא תקין - צפויה מערך של התראות');
    }
    
    return data;
  } catch (err) {
    console.error('שגיאה בשליפת התראות:', err.message);
    return []; 
  }
}
export async function markNotificationAsRead(id) {
  try {
    const res = await fetch(`${API_BASE}/${id}/mark-read`, {
      method: 'PATCH',
      credentials: 'include',
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`שגיאה בסימון כהתראה נקראה (${res.status}): ${errText}`);
    }
  } catch (err) {
    console.error(`שגיאה בסימון התראה ${id} כנקראה:`, err.message);
  }
}

export async function markAllNotificationsAsRead() {
  try {
    const res = await fetch(`${API_BASE}/mark-all-read`, {
      method: 'PATCH',
      credentials: 'include',
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`שגיאה בסימון כל ההתראות כנקראו (${res.status}): ${errText}`);
    }
  } catch (err) {
    console.error('שגיאה בסימון כל ההתראות כנקראו:', err.message);
  }
}

