import { useEffect, useState } from "react";
import { getNotifications } from "../api/notificationsApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      const allNotifications = await getNotifications();
      const unread = allNotifications.filter(
        (notif) => notif.status === "unread"
      );
      setUnreadCount(unread.length);
    };

    fetchNotifications();
  }, []);

  const handleClick = () => {
    navigate("/notifications");
  };

  return (
    <button
      onClick={handleClick}
      style={{
        position: "relative",
        background: "transparent",
        border: "none",
        cursor: "pointer",
      }}
      aria-label="Notifications"
    >
      <FontAwesomeIcon icon={faBell} size="lg" />
      {unreadCount > 0 && (
        <span
          style={{
            position: "absolute",
            top: "-6px",
            right: "-10px",
            background: "red",
            color: "white",
            borderRadius: "50%",
            padding: "2px 6px",
            fontSize: "12px",
            fontWeight: "bold",
            lineHeight: 1,
          }}
        >
          {unreadCount}
        </span>
      )}
    </button>
  );
};

export default Notifications;
