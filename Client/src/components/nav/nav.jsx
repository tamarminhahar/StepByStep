import { useNavigate } from 'react-router-dom';
import styles from './nav.module.css'
import Cookies from 'js-cookie';

function Nav() {
    const navigate = useNavigate();
    const { currentUser, setCurrentUser } = useCurrentUser();
const handleLogout = async () => {
    await fetch('http://localhost:3000/users/logout', {
        method: 'POST',
        credentials: 'include',
    });

    Cookies.remove('currentUser');
    Cookies.remove('role');
    setCurrentUser({ id: -1, name: '' });
    navigate('/login');
};

    return (
        <nav className={styles.nav}>
            <button onClick={() => navigate('/home')} className={styles.navButton}>Home</button>
            <button onClick={() => navigate(`/info`)} className={styles.navButton}>Info</button>
            <button onClick={() => navigate(`/users/${currentUser.id}/posts`)} className={styles.navButton}>Posts</button>
            <button onClick={() => navigate('/Calendar')} className={styles.navButton}>Calendar</button>

            <button onClick={handleLogout} className={styles.navButton}>Logout</button>
        </nav>

    )
}
export default Nav