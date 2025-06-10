import { useEffect, useState } from "react";
import { getSessions } from "../api/sessionApi";
import { getGoals } from "../api/goalsApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDumbbell, faBullseye } from "@fortawesome/free-solid-svg-icons";
import ActivityChart from "./ActivityChart";

const ActivityHistory = () => {
  const [activityLog, setActivityLog] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sessions, goals] = await Promise.all([getSessions(), getGoals()]);

        const sessionActivities = sessions.map((s) => ({
          date: s.date,
          type: "session",
          label: `Séance: ${s.title} (${s.duration} min)`,
          icon: faDumbbell,
          intensity: s.intensity || 1, // Valeur d'intensité par défaut
        }));

        const progressActivities = goals.flatMap((goal) =>
          (goal.progress || []).map((p) => ({
            date: p.updated_at,
            type: "goal",
            label: `Objectif "${goal.title}": ${p.current_value}/${goal.target_value}`,
            icon: faBullseye,
            intensity: 0.5, // Moins intense qu'une séance
          }))
        );

        const allActivities = [...sessionActivities, ...progressActivities];
        allActivities.sort((a, b) => new Date(b.date) - new Date(a.date));

        setActivityLog(allActivities);
      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return <div>Chargement des activités...</div>;

  return (
    <div style={{width: '25rem' ,padding: "1rem", background: "white", borderRadius: "20px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
      {activityLog.length > 0 && <ActivityChart activities={activityLog} />}
      
      {/* <h3 style={{ marginTop: "2rem", marginBottom: "1rem", color:'black'}}>Détails des activités</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {activityLog.slice(0, 10).map((a, idx) => (
          <li
            key={idx}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "0.8rem",
              borderBottom: "1px solid #eee",
              paddingBottom: "0.8rem",
            }}
          >
            <FontAwesomeIcon
              icon={a.icon}
              style={{ 
                marginRight: "0.8rem", 
                width: "20px",
                color: a.type === "session" ? "#4a6baf" : "#6baf4a"
              }}
            />
            <span style={{ flex: 1 }}>{a.label}</span>
            <small style={{ color: "#666" }}>
              {new Date(a.date).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "short",
                year: "numeric"
              })}
            </small>
          </li>
        ))}
      </ul> */}
    </div>
  );
};

export default ActivityHistory;