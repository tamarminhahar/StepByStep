import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ParticipantsPopup({ eventId, onClose }) {
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    axios.get(`/api/events/${eventId}/participants`)
      .then(res => setParticipants(res.data))
      .catch(err => console.error(err));
  }, [eventId]);

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h3>משתתפי האירוע</h3>
        <ul>
          {participants.map(p => (
            <li key={p.id}>{p.user_name}</li>
          ))}
        </ul>
        <button onClick={onClose}>סגור</button>
      </div>
    </div>
  );
}
