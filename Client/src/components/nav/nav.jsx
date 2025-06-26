
import { useNavigate } from 'react-router-dom';
import styles from './nav.module.css';
import APIRequests from "../../services/ApiClientRequests";

function Nav() {
  const navigate = useNavigate();

  const handleLogout = async () => {
  try {
    await APIRequests.postRequest("users/logout");
    navigate("/login");
  } catch (error) {
    console.error("שגיאה ביציאה:", error.message);
  }
};


  return (
    <nav className={styles.nav}>
      <button
        onClick={() => navigate(`/home`)}
        className={styles.navButton}> בית </button>
     <button 
        onClick={() => navigate('/notification')}
        className={styles.navButton} >
        הודעות 
      </button>
      <button onClick={() => navigate(`/posts`)} className={styles.navButton} >
        פוסטים
      </button>
      <button
        onClick={() => navigate(`/calendar`)} className={styles.navButton} >
        לוח שנה
      </button>
      <button onClick={() => navigate('/chat')} className={styles.navButton} >
        צ'אט
      </button>
      <button onClick={handleLogout} className={styles.navButton} >
        יציאה
      </button>
    </nav>
  );
}
export default Nav;
