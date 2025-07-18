
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { toast } from 'react-toastify';
import ApiClientRequests from '../../services/ApiClientRequests.js'
import styles from './chatStyle/ChatList.module.css';
import Nav from '../nav/Nav.jsx';
import  socket  from '../../services/socket.js';

export default function ChatList() {
  const location = useLocation();
  const initialMode = location.state?.mode || 'supporter'; 
  const [mode, setMode] = useState(initialMode);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [pendingMap, setPendingMap] = useState({});
  const { currentUser } = useCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!mode || !currentUser) return;
    setLoading(true);

    const fetchUsers = async () => {
      try {
        const users = await ApiClientRequests.getRequest(`users/available?mode=${mode}`);
        const filtered = users.filter((u) => u.id !== currentUser.id);
        setUsers(filtered);
      } catch (err) {
        toast.error('אירעה שגיאה בטעינת המשתמשים');
      } finally {
        setLoading(false);
      }
    };

    const fetchPending = async () => {
      try {
        const pending = await ApiClientRequests.getRequest(`chat/pending`);
        const map = {};
        pending.forEach((msg) => {
          if (!map[msg.senderId]) map[msg.senderId] = true;
        });
        setPendingMap(map);
      } catch (err) {
        toast.error('שגיאה בטעינת הודעות ממתינות:', err);
      }
    };

    fetchUsers();
    fetchPending();
  }, [mode, currentUser]);

  const startChat = (user) => {
    navigate(`/chat/session/${user.user_name}`, {
      state: {
        otherUserId: user.id,
        userName: user.user_name,
        mode
      }
    });
  };

useEffect(() => {
    socket.on('user_status_change', ({ userId, isOnline }) => {
        setUsers(prev =>
            prev.map(user =>
                user.id === userId ? { ...user, is_online: isOnline } : user
            )
        );
    });

    return () => {
        socket.off('user_status_change');
    };
}, []);

  if (!currentUser) return null;

  const filteredUsers = users.filter(user =>
    user.user_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.chatListContainer}>
      <Nav />
 
{currentUser.role !== 'supporter' && (
  <div className={styles.modeSelector}>
    <button
      className={styles.modeButton}
      onClick={() => setMode('supporter')}
      style={{ opacity: mode === 'supporter' ? 1 : 0.6 }}
    >
      שיחה עם תומך
    </button>
    <button
      className={styles.modeButton}
      onClick={() => setMode('bereaved')}
      style={{ opacity: mode === 'bereaved' ? 1 : 0.6 }}
    >
      שיחה עם אבל
    </button>
  </div>
)}

      <h3 className={styles.header}>
        בחר {mode === 'supporter' ? 'תומך' : 'אבל'} לשיחה
      </h3>
      <input
        type="text"
        className={styles.searchInput}
        placeholder="חפש לפי שם..."
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loading && <p className={styles.loading}>טוען משתמשים זמינים...</p>}
      {!loading && users.length === 0 && <p className={styles.noUsers}>לא נמצאו משתמשים זמינים לשיחה כרגע.</p>}

      {!loading && filteredUsers.map((user) => {
        const hasUnread = pendingMap[user.id];
        return (
          <button
            key={user.id}
            className={styles.userButton}
            onClick={() => startChat(user)}
          >
            <span
              className={styles.statusDot}
              style={{ backgroundColor: user.is_online ? 'green' : 'gray' }}
            ></span>

            <span style={{ fontWeight: hasUnread ? 'bold' : 'normal' }}>
              {user.user_name}
            </span>

            {hasUnread && (
              <span className={styles.newMessageBadge}>הודעה חדשה</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
