const API_BASE = 'http://localhost:3000/chat';

export async function getChatHistory(sessionId) {
  const res = await fetch(`${API_BASE}/history/${sessionId}`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch chat history');
  }

  return res.json();
}

export async function getPendingMessages() {
  console.log(pending)
  const res = await fetch(`${API_BASE}/pending`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('שגיאה בטעינת הודעות ממתינות');
  }

  return res.json();
}

export async function startChatSession(otherUserId, isAnonymous = false) {
  const res = await fetch(`${API_BASE}/start`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ otherUserId, isAnonymous }),
  });

  if (!res.ok) {
    throw new Error('Failed to start chat session');
  }

  return res.json(); // מחזיר { sessionId }
}

// אופציונלי – לשליחה דרך API במקום דרך socket
export async function sendMessageToSession(sessionId, message) {
  const res = await fetch(`${API_BASE}/send`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sessionId, message }),
  });

  if (!res.ok) {
    throw new Error('Failed to send message');
  }

  return res.json();
}
export async function getAvailableUsersByMode(mode) {
  const res = await fetch(`http://localhost:3000/users/available?mode=${mode}`, {
    method: 'GET',
    credentials: 'include'
  });

  if (!res.ok) throw new Error('Failed to fetch users by mode');
  return res.json();
}
