import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./notificationStyle/NotificationPanel.module.css";
import { socket } from "../../services/socket";
import APIRequests from "../../services/ApiClientRequests";
import Nav from "../nav/Nav";
import { toast } from "react-toastify";
import ParticipantsPopup from "../calendar/ParticipantsPopup"; // או הנתיב אצלך

export default function NotificationPanel({ mode = "panel" }) {
  const [notifications, setNotifications] = useState([]);
  const [visible, setVisible] = useState(true);
  const navigate = useNavigate();
  const [selectedEventId, setSelectedEventId] = useState(null);

  useEffect(() => {
    APIRequests.getRequest("api/notification")
      .then(setNotifications)
      .catch((err) => {
        toast.error("שגיאה בשליפת התראות:", err.message);
      });

    socket.on("new_notification", (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });

    return () => socket.off("new_notification");
  }, []);

  async function handleMarkAsRead(id) {
    try {
      await APIRequests.patchRequest(`api/notification/${id}/mark-read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (err) {
      toast.error(`שגיאה בסימון התראה ${id} כנקראה:`, err.message);
    }
  }

  async function handleMarkAllAsRead() {
    try {
      await APIRequests.patchRequest("api/notification/mark-all-read");
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (err) {
      toast.error("שגיאה בסימון כל ההתראות כנקראו:", err.message);
    }
  }

  if (!visible && mode === "popup") return null;

  const containerClass =
    mode === "popup" ? styles.notificationContainer : "notification-panel-full";
  const itemClass = (n) =>
    mode === "popup"
      ? `${styles.notificationItem} ${n.is_read ? styles.read : ""}`
      : n.is_read
        ? "notification read"
        : "notification unread";
  const openParticipantsPopup = (eventId) => {
    setSelectedEventId(eventId);
  };
  return (
    <div className={containerClass}>
      <Nav />
      {mode === "popup" ? (
        <div className={styles.notificationHeader}>
          <h2 className={styles.notificationTitle}>התראות</h2>
          <div>
            <button
              className={styles.markAllButton}
              onClick={handleMarkAllAsRead}
            >
              סמן הכול כנקרא
            </button>
            <button
              className={styles.notificationCloseButton}
              onClick={() => setVisible(false)}
            >
              ✕
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.notificationHeader}>
          <h1 className={styles.notificationTitle}>התראות</h1>
          <button
            className={styles.markAllButton}
            onClick={handleMarkAllAsRead}
          >
            סמן הכול כנקרא
          </button>
        </div>
      )}

      {notifications.length === 0 ? (
        <p className={styles.emptyText}>אין התראות להצגה</p>
      ) : (
        notifications.map((n) => (
          <div
            key={n.id}
            className={itemClass(n)}
            onClick={async () => {
              if (!n.is_read) {
                try {
                  await handleMarkAsRead(n.id);
                } catch (err) {
                  toast.error("שגיאה בסימון ההתראה כנקראה");
                  return;
                }
              }
              if (n.target_url) navigate(n.target_url);
            }}
          >
            <span>{n.message}</span>

            {/* כפתור עין להצגת משתתפים אם זו התראת אירוע */}
            {n.type === "event_participation" && (
              <button
                onClick={(e) => {
                  e.stopPropagation(); // מונע מהלחיצה לפתוח לינק
                  openParticipantsPopup(n.eventId);
                }}
                className={styles.eyeButton}
              >
                👁
              </button>
            )}

            {n.is_read && <span className={styles.readCheck}>✔</span>}
          </div>
        ))
      )}
      {/* הפופאפ של המשתתפים */}
      {selectedEventId && (
        <ParticipantsPopup eventId={selectedEventId} onClose={() => setSelectedEventId(null)} />
      )}
    </div>
  );

}
