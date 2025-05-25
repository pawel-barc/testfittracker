import { useEffect, useState } from "react";
import { getUserStat } from "../api/userStatsApi";

function UserStatList() {
  const [stats, setStats] = useState([]);

  const loadStats = async () => {
    const data = await getUserStat();
    if (!data.error) {
      setStats(data);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <div className="stat-list">
      <h2>Histoire des statistiques</h2>
      {stats.length === 0 ? (
        <p>Pas des données</p>
      ) : (
        <ul>
          {stats.map((stat) => (
            <li key={stat.id}>
              <strong>{new Date(stat.created_at).toLocaleDateString()}</strong>{" "}
              - Poids: {stat.weight} kg, Taille: {stat.height} cm, BMI:{" "}
              {stat.bmi}
              {stat.body_fat_percentage &&
                `, Fat %: ${stat.body_fat_percentage}`}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UserStatList;
