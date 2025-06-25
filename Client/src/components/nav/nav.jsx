
import { useNavigate } from 'react-router-dom';
import styles from './nav.module.css';


function Nav() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await fetch('http://localhost:3000/users/logout', {
      method: 'POST',
      credentials: 'include',
    });
    navigate('/login');
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
