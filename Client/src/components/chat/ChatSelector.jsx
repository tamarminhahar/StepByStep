
import { useNavigate } from 'react-router-dom';
import styles from './chatStyle/ChatSelector.module.css';
import Nav from '../nav/Nav.jsx';
import { useCurrentUser } from '../hooks/useCurrentUser';

export default function ChatSelector() {
  const navigate = useNavigate();
  const { currentUser } = useCurrentUser();

  const handleModeSelect = (mode) => {
    navigate('/chat/select', { state: { mode } });
  };
  if (!currentUser) return null;


  return (
    <div className={styles.container}>
      <Nav />
      <h2 className={styles.title}>עם מי תרצה/י לשוחח?</h2>

      <div className={styles.cardContainer}>
        {currentUser.role === 'bereaved' && (
          <>
            <div className={styles.card} onClick={() => handleModeSelect('supporter')}>
              <h3>תומך</h3>
              <p>קבל תמיכה רגשית ממי שמבין אותך</p>
            </div>

            <div className={styles.card} onClick={() => handleModeSelect('bereaved')}>
              <h3>אבל אחר</h3>
              <p>שוחח עם מישהו שחווה אובדן דומה</p>
            </div>
          </>
        )}

        {currentUser.role === 'supporter' && (
          <div className={styles.card} onClick={() => handleModeSelect('bereaved')}>
            <h3>אבל שחווה אובדן</h3>
            <p>תמוך באבל הזקוק לשיחה ותמיכה</p>
          </div>
        )}
      </div>
    </div>
  );
}
