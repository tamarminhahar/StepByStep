

import { useEffect, useState } from 'react';
import ApiClientRequests from '../../ApiClientRequests';
import styles from './chatStyle/PendingMessages.module.css'; // אופציונלי: יצירת קובץ CSS

export default function PendingMessages() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const messages = await ApiClientRequests.getRequest(`chat/pending`);
        setCount(messages.length);
      } catch (err) {
        console.error('שגיאה בשליפת הודעות שלא נקראו:', err);
      }
    }

    fetchData();
  }, []);

  if (count === 0) return null;

  return (
    <div className={styles.badge}>
      יש לך {count} הודעות חדשות בצ'אט
    </div>
  );
}
