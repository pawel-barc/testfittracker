import AddUserStatForm from "../components/AddUserStatForm";
import UserStatList from "../components/UserStatList";
import ActivityHistory from "../components/ActivityHistory";
import GoalList from "../components/GoalList";
import Notifications from "../components/Notifications";
import CalendarPage from "./CalendarPage";
import SessionsList from "../components/SessionsList";
import { useState } from "react";
import useAuthStore from "../store/AuthStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBullseye, faWeightScale } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
const Dashboard = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [showStatForm, setShowStatForm] = useState(false);
  const user = useAuthStore((state) => state.user);
  const handleStatAdded = () => {
    setRefreshKey((prev) => prev + 1);
    setShowStatForm(false);
  };
  const navigate = useNavigate();

  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="user-stat-page">
      <h1>Bonjour {user.first_name}</h1>
      <strong>{today}</strong>
      <Notifications />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
          alignItems: "center",
        }}
      >
        <div>
          {" "}
          <h2>7h30</h2>
          <p>Sommeil</p>
        </div>
        <div>
          <h2>2L</h2>
          <p>Eau</p>
        </div>
        <div>
          <h2>159Kc</h2>
          <p>Calories</p>
        </div>
      </div>

      <hr />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <CalendarPage />
          <button onClick={() => navigate("/calendar")}>
            🗓️ Voir le calendrier
          </button>
        </div>
        <button
          style={{ width: "20vw", height: "20vw", background: "grey" }}
          onClick={() => navigate("/goals")}
        >
          <FontAwesomeIcon icon={faBullseye} /> Ajouter un objectif
        </button>
      </div>
      <hr />
      <ActivityHistory />
      <hr />
      <h1 style={{ textAlign: "center" }}>
        {user.first_name} {user.last_name}
      </h1>
      <button
        onClick={() => setShowStatForm((prev) => !prev)}
        style={{
          margin: "1rem 0",
          padding: "1rem",
          fontSize: "1.2rem",
          backgroundColor: "#f0f0f0",
          border: "1px solid #ccc",
          borderRadius: "8px",
          cursor: "pointer",
          width: "100%",
        }}
      >
        <FontAwesomeIcon icon={faWeightScale} />{" "}
        {showStatForm ? "Annuler" : "➕ Ajouter des statistiques"}
      </button>
      {showStatForm && <AddUserStatForm onStatAdded={handleStatAdded} />}
      <UserStatList key={refreshKey} />
      <hr />

      <GoalList />
      <hr />
      <SessionsList />
      <hr />
    </div>
  );
};

export default Dashboard;
