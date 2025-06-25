// 4. calendarService.js
const API_BASE = 'http://localhost:3000/api/calendar';

export async function fetchUserEvents() {
    const res = await fetch(`${API_BASE}/user/me`, {
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to fetch events');
    return await res.json();
}

export async function createOrUpdateEvent(event, isEdit = false) {
    const url = isEdit ? `${API_BASE}/${event.id}` : API_BASE;
    const method = isEdit ? 'PUT' : 'POST';

    return fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(event),
    });
}

export async function deleteEventById(id) {
    return fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });
}


export async function updateParticipationStatus(eventId, status) {
    return await fetch(`${API_BASE}/${eventId}/participation`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status }),
    });
}

