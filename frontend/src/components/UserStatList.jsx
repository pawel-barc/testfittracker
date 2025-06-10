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
      <div className="latest-stat-header">
        <div >
          <div className="latest-stat-title">Poids</div>
          <div className="latest-stat-number">{latestStat.weight} kg</div>
        </div>
        <div>
          <div className="latest-stat-title">Taille</div>
          <div className="latest-stat-number"> {latestStat.height} cm</div>
        </div>
        <div>
          <div className="latest-stat-title">BMI{" "}</div>
          <div className="latest-stat-number">{latestStat.bmi}</div>
      </div>
    </div>
  </div>
  );
}

export default UserStatList;
