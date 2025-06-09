// components/CurrentUserStat.jsx
import { useEffect, useState } from "react";
import { getUserStat } from "../api/userStatsApi";

const CurrentUserStat = () => {
  const [latest, setLatest] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      const data = await getUserStat();
      if (Array.isArray(data) && data.length > 0) {
        const sorted = [...data].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setLatest(sorted[0]);
      }
    };
    fetchStats();
  }, []);

  if (!latest) return <p>Aucune donnée récente</p>;

  return (
    <div className="current-stat">
      <h3>📊 Statistique actuelle</h3>
      <p>Date: {new Date(latest.created_at).toLocaleDateString()}</p>
      <p>Poids: {latest.weight} kg</p>
      <p>Taille: {latest.height} cm</p>
      <p>BMI: {latest.bmi}</p>
      {latest.body_fat_percentage && <p>Fat %: {latest.body_fat_percentage}</p>}
    </div>
  );
};

export default CurrentUserStat;
