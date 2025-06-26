
import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useCurrentUser } from '../hooks/useCurrentUser';
import ApiClientRequests from '../../services/ApiClientRequests'
import styles from './chatStyle/ChatWindow.module.css';
import  socket  from '../../services/socket';
import Nav from '../nav/Nav';

export default function ChatWindow() {
  const { currentUser } = useCurrentUser();
  const location = useLocation();
  const { otherUserId, userName, mode } = location.state || {};
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [lastUnreadMessageId, setLastUnreadMessageId] = useState(null);
  const [typingUserName, setTypingUserName] = useState(null);
  const [liveMessage, setLiveMessage] = useState('');
  const messagesEndRef = useRef(null);
  const messageSound = useRef(null);

  // Scroll chat to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  };

  // Load sound on mount
  useEffect(() => {
    messageSound.current = new Audio('/sounds/button-09a.mp3');
  }, []);

  // Start chat and fetch messages
  useEffect(() => {
    if (!currentUser || !otherUserId || !mode) return;

    const fetchAndStartChat = () => {
      socket.emit(
        'start_chat',
        {
          otherUserId: parseInt(otherUserId),
          isAnonymous: mode === 'anonymous'
        },
        async (res) => {
          if (res.error) {
            console.error('Failed to start chat:', res.error);
            return;
          }
          const sessionId = res.sessionId;
          setSessionId(sessionId);
          setMessages(res.history);
          setTimeout(scrollToBottom, 0);
        }
      );
    };

    fetchAndStartChat();

    socket.on('receive_message', (msg) => {
      // Avoid duplicate message
      setMessages((prevMessages) => {
        const exists = prevMessages.some((m) => m.id === msg.id);
        if (exists) return prevMessages;
        return [...prevMessages, msg];
      });

      if (msg.senderId !== currentUser.id) {
        setLastUnreadMessageId(msg.id);
        if (soundEnabled) messageSound.current?.play().catch(() => { });
        setLiveMessage(`הודעה חדשה מ־${userName || `משתמש ${msg.senderId}`}`);
      }
    });

    socket.on('message seen confirmation', ({ messageId }) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === messageId && !msg.seenAt
            ? { ...msg, seenAt: new Date().toISOString() }
            : msg
        )
      );
    });

    socket.on('message_deleted', ({ messageId }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? { ...msg, message: 'ההודעה נמחקה', deleted: true }
            : msg
        )
      );
      setLiveMessage('הודעה נמחקה');
    });

    socket.on('user_typing', ({ userId, userName }) => {
      if (userId !== currentUser.id) {
        setTypingUserName(userName);
        setLiveMessage(`${userName} מקליד/ה...`);
      }
    });

    socket.on('user_stopped_typing', ({ userId }) => {
      if (userId !== currentUser.id) {
        setTypingUserName(null);
      }
    });

    return () => {
      socket.emit('user_left_chat');
      socket.off('receive_message');
      socket.off('message seen confirmation');
      socket.off('message_deleted');
      socket.off('user_typing');
      socket.off('user_stopped_typing');
    };
  }, [currentUser, otherUserId, mode, soundEnabled]);

  // Join to session after sessionId is known
  useEffect(() => {
    if (sessionId) {
      socket.emit('user_in_chat', { sessionId });
      socket.emit('user_online', { sessionId });
    }
  }, [sessionId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (currentUser?.id) socket.emit('register user');
  }, [currentUser]);

  const handleSendMessage = () => {
    if (!input.trim() || !sessionId) return;

    socket.emit('send_message', {
      sessionId,
      message: input
    });
    setInput('');
  };

  const toggleSound = () => {
    setSoundEnabled((prev) => !prev);
  };

  const getDisplayName = (senderId) => {
    if (senderId === currentUser.id) return 'את/ה';
    return mode === 'anonymous' ? 'משתמש אנונימי' : userName;
  };

  return (
    <>
      <Nav />
      <div className={styles.chatContainer}>
        <div className={styles.chatHeader}>
          <h3>צ'אט עם {userName || `משתמש ${otherUserId}`}</h3>
          <button onClick={toggleSound} className={styles.soundToggle}>
            {soundEnabled ? '🔊' : '🔇'}
          </button>
        </div>

        <div className={styles.chatBox}>
          {messages.map((msg, index) => (
            <div key={msg.id || index}>
              <div className={msg.senderId === currentUser.id ? styles.messageRight : styles.messageLeft}>
                <div className={styles.senderName}>{getDisplayName(msg.senderId)}</div>
                <div className={styles.messageBubble + (msg.deleted ? ' ' + styles.deletedMessage : '')}>
                  {msg.deleted ? '🗑 ההודעה נמחקה' : msg.message}
                  {msg.senderId === currentUser.id && !msg.deleted && (
                    <button
                      className={styles.deleteButton}
                      onClick={() => socket.emit('delete_message', { messageId: msg.id })}>
                      🗑
                    </button>
                  )}
                </div>
                {msg.senderId === currentUser.id && msg.seenAt && (
                  <div className={styles.seenCheck}>✓</div>
                )}
              </div>
            </div>
          ))}
          {typingUserName && (
            <div className={styles.typingIndicator}>{typingUserName} מקליד/ה...</div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className={styles.inputRow}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => {
              if (lastUnreadMessageId) {
                socket.emit('message seen', { messageId: lastUnreadMessageId });
                setLastUnreadMessageId(null);
              }
              socket.emit('user_typing', {
                sessionId,
                userName: currentUser.user_name,
                userId: currentUser.id
              });
            }}
            onBlur={() => {
              socket.emit('user_stopped_typing', {
                sessionId,
                userId: currentUser.id
              });
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            className={styles.inputField}
            placeholder="כתוב הודעה..."
          />
          <button className={styles.sendButton} onClick={handleSendMessage}>שלח</button>
        </div>

        <div aria-live="polite" style={{ position: 'absolute', left: '-9999px' }}>
          {liveMessage}
        </div>
      </div>
    </>
  );
}
