import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./notificationStyle/NotificationPanel.module.css";
import { socket } from "../services/socket";
import APIRequests from "../services/ApiClientRequests";
import Nav from "../Nav/Nav";

export default function NotificationPanel({ mode = "panel" }) {
  const [notifications, setNotifications] = useState([]);
  const [visible, setVisible] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    APIRequests.getRequest("api/notification")
      .then(setNotifications)
      .catch((err) => {
        console.error("שגיאה בשליפת התראות:", err.message);
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
      console.error(`שגיאה בסימון התראה ${id} כנקראה:`, err.message);
    }
  }

  async function handleMarkAllAsRead() {
    try {
      await APIRequests.patchRequest("api/notification/mark-all-read");
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (err) {
      console.error("שגיאה בסימון כל ההתראות כנקראו:", err.message);
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
            onClick={() => {
              handleMarkAsRead(n.id);
              if (n.target_url) navigate(n.target_url);
            }}
          >
            <span>{n.message}</span>
            {n.is_read && <span className={styles.readCheck}>✔</span>}
          </div>
        ))
      )}
    </div>
  );
}
