import { useEffect, useState } from "react";
import {
  getNotifications,
  markNotificationAsRead,
} from "../api/notificationsApi";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getNotifications();
      console.log("Notifications from backend:", data);
      setNotifications(data);
    };
    fetchData();
  }, []);

  const handleMarkAsRead = async (id) => {
    await markNotificationAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: "read" } : n))
    );
  };

  return (
    <div>
      <h2>📬 Notifications</h2>
      {notifications.length === 0 ? (
        <p>Pas de nouvelles notifications.</p>
      ) : (
        notifications.map((notif) => (
          <div key={notif.id} style={{ marginBottom: "1rem" }}>
            <p>{notif.message}</p>
            {notif.status === "unread" && (
              <button onClick={() => handleMarkAsRead(notif.id)}>
                Marquer comme lue
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Notifications;
