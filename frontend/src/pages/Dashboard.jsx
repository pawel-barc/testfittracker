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
import "../style/Dashboard.css";

const Modal = ({ children, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const handleStatAdded = () => {
    setRefreshKey((prev) => prev + 1);
    setIsModalOpen(false);
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
      <div className="user-stat-left">
        <div className="user-stat-header">
          <h1>Bonjour, {user.first_name} !</h1>
          <div className="user-stat-header-right">
            <div className="user-stat-date">
              <p>{today}</p>
            </div>
            <Notifications />
          </div>
        </div>
        <div className="user-stat-summary">
          <div className="user-stat-summary-item">
            <div>
              <h2>7h30</h2>
              <p>Sommeil</p>
            </div>
            <img src="/images/sleep-icon.png" alt="sleep icon" />
          </div>
          <div className="user-stat-summary-item">
            <div>
              <h2>2L</h2>
              <p>Eau</p>
            </div>
            <img src="/images/water-icon.png" alt="water icon" />
          </div>
          <div className="user-stat-summary-item">
            <div>
              <h2>159Kc</h2>
              <p>Calories</p>
            </div>
            <img src="/images/calories-icon.png" alt="calories icon" />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
            marginTop: "3rem",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <CalendarPage />
          </div>
          <ActivityHistory />
        </div>
      </div>

      <div className="user-stat-right">
        <div className="user-stat-right-header">
          <h1>
            {user.first_name} {user.last_name}
          </h1>
          <button
            onClick={() => setIsModalOpen(true)}
            style={{
              margin: "1rem 0",
              padding: "1rem",
              fontSize: "1.2rem",
              backgroundColor: "#f0f0f0",
              borderRadius: "8px",
              cursor: "pointer",
              border: "none",
            }}
          >
            <FontAwesomeIcon icon={faWeightScale} />
          </button>
        </div>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <AddUserStatForm onStatAdded={handleStatAdded} />
        </Modal>

        <UserStatList key={refreshKey} />

        <button
          style={{ width: "2rem", height: "2rem", background: "#00A5A3" }}
          onClick={() => navigate("/goals")}
        >
          <img src="/images/pencil.png" alt="" />
        </button>

        <GoalList />
        <hr />
        <SessionsList />
        <hr />
      </div>
    </div>
  );
};

export default Dashboard;
