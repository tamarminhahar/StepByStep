// // ✅ ChatSelector.jsx — עם עיצוב חדשני
// import { useNavigate } from 'react-router-dom';
// import styles from './chatStyle/ChatSelector.module.css';
// import Nav from '../nav/nav.jsx';
// export default function ChatSelector() {
//   const navigate = useNavigate();

//   const handleModeSelect = (mode) => {
//     navigate(`/chat/select?mode=${mode}`);
//   };

//   return (
//     <div className={styles.container}>
//             <Nav />

//       <h2 className={styles.title}>בחר עם מי ברצונך לשוחח:</h2>
//       <div className={styles.buttonGroup}>
//         <button className={styles.chatButton} onClick={() => handleModeSelect('supporter')}>
//           תומך
//         </button>
//         <button className={styles.chatButton} onClick={() => handleModeSelect('bereaved')}>
//           אבל אחר
//         </button>
//       </div>
//     </div>
//   );
// }
import { useNavigate } from 'react-router-dom';
import styles from './chatStyle/ChatSelector.module.css';
import Nav from '../nav/nav.jsx';

export default function ChatSelector() {
  const navigate = useNavigate();

  const handleModeSelect = (mode) => {
    navigate('/chat/select', { state: { mode } });
  };

  return (
    <div className={styles.container}>
      <Nav />
      <h2 className={styles.title}>עם מי תרצה/י לשוחח?</h2>

      <div className={styles.cardContainer}>
        <div className={styles.card} onClick={() => handleModeSelect('supporter')}>
          <h3>תומך</h3>
          <p>קבל תמיכה רגשית ממי שמבין אותך</p>
        </div>

        <div className={styles.card} onClick={() => handleModeSelect('bereaved')}>
          <h3>אבל אחר</h3>
          <p>שוחח עם מישהו שחווה אובדן דומה</p>
        </div>
      </div>
    </div>
  );
}
