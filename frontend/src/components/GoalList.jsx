import { useEffect, useState } from "react";
import { getGoals, deleteGoal } from "../api/goalsApi";
import ProgressForm from "./ProgressForm";
import { useNavigate } from "react-router-dom";

const GoalList = () => {
  const [goals, setGoals] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [visibleFormId, setVisibleFormId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGoals = async () => {
      const data = await getGoals();
      setGoals(data);
    };
    fetchGoals();
  }, [refreshKey]);

  const handleDelete = async (goalId) => {
    await deleteGoal(goalId);
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <h2>Mes objectifs</h2>
        <button
          className="add-goal-button"
          onClick={() => navigate("/goals")}
        >
          <img src="/images/pencil.png" alt="Modifier les objectifs" />
        </button>
      </div>
      
      {goals.map((goal) => {
        const sortedProgress = [...(goal.progress || [])].sort(
          (a, b) => new Date(a.updated_at) - new Date(b.updated_at)
        );

        const initial = parseFloat(sortedProgress[0]?.current_value ?? 0);
        const current = parseFloat(
          sortedProgress.at(-1)?.current_value ?? initial
        );
        const target = parseFloat(goal.target);

        const isDecrease = initial > target;

        let percent = isDecrease
          ? ((initial - current) / (initial - target)) * 100
          : ((current - initial) / (target - initial)) * 100;

        percent = Math.min(Math.max(percent, 0), 100).toFixed(1);

        return (
          <div key={goal.id} style={{ marginBottom: "1rem" }}>
            <p style={{ display: "flex", alignItems: "center", justifyContent:'space-between', gap: "0.5rem" }}>
            <strong>{goal.title}</strong>
               {current} / {target}
            </p>
            <div
              style={{
                background: "#ccc",
                borderRadius: "8px",
                overflow: "hidden",
                height: "16px",
              }}
            >
              <div
                style={{
                  background: "#4caf50",
                  width: `${percent}%`,
                  height: "100%",
                }}
              ></div>
            </div>

            <div style={{ marginTop: "0.5rem" }}>
              <button className="edit-goal-button"
                onClick={() =>
                  setVisibleFormId(visibleFormId === goal.id ? null : goal.id)
                }
              >
                {visibleFormId === goal.id ? "Annuler" : "Modifier"}
              </button>

              <button
              className="delete-goal-button"
                onClick={() => handleDelete(goal.id)}
                style={{ marginLeft: "0.5rem" }}
              >
                Supprimer
              </button>
            </div>

            {visibleFormId === goal.id && (
              <ProgressForm
                goalId={goal.id}
                onProgressAdded={() => {
                  setRefreshKey((prev) => prev + 1);
                  setVisibleFormId(null);
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default GoalList;