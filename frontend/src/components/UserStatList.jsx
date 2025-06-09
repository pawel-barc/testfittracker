import { useEffect, useState } from "react";
import { getUserStat } from "../api/userStatsApi";

function UserStatList() {
  const [latestStat, setLatestStat] = useState(null);

  const loadStats = async () => {
    const data = await getUserStat();
    if (!data.error && data.length > 0) {
      const sorted = [...data].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      setLatestStat(sorted[0]);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (!latestStat) return <p>Aucune statistique enregistrée.</p>;

  return (
    <div className="latest-stat">
      <h2>Statistique actuelle</h2>
      <p>
        <strong>{new Date(latestStat.created_at).toLocaleDateString()}</strong>{" "}
        - Poids: {latestStat.weight} kg, Taille: {latestStat.height} cm, BMI:{" "}
        {latestStat.bmi}
        {latestStat.body_fat_percentage &&
          `, Fat %: ${latestStat.body_fat_percentage}`}
      </p>
    </div>
  );
}

export default UserStatList;
