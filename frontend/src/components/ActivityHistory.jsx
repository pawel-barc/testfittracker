import { useEffect, useState } from "react";
import { getSessions } from "../api/sessionApi";
import { getGoals } from "../api/goalsApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDumbbell, faBullseye } from "@fortawesome/free-solid-svg-icons";

const ActivityHistory = () => {
  const [activityLog, setActivityLog] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [sessions, goals] = await Promise.all([getSessions(), getGoals()]);

      const sessionActivities = sessions.map((s) => ({
        date: s.date,
        type: "session",
        label: `Séance: ${s.title} (${s.duration} min)`,
        icon: faDumbbell,
      }));

      const progressActivities = goals.flatMap((goal) =>
        (goal.progress || []).map((p) => ({
          date: p.updated_at,
          type: "goal",
          label: `Objectif "${goal.title}": ${p.current_value}`,
          icon: faBullseye,
        }))
      );

      const allActivities = [...sessionActivities, ...progressActivities];

      allActivities.sort((a, b) => new Date(b.date) - new Date(a.date));

      setActivityLog(allActivities.slice(0, 15));
    };

    fetchData();
  }, []);

  return (
    <div style={{ padding: "1rem" }}>
      <h2>📋 Activités récentes</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {activityLog.map((a, idx) => (
          <li
            key={idx}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "0.5rem",
              borderBottom: "1px solid #ddd",
              paddingBottom: "0.5rem",
            }}
          >
            <FontAwesomeIcon
              icon={a.icon}
              style={{ marginRight: "0.5rem", width: "20px" }}
            />
            <span style={{ flex: 1 }}>{a.label}</span>
            <small style={{ color: "#888" }}>
              {new Date(a.date).toLocaleDateString()}
            </small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityHistory;
