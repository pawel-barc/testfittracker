// pages/StatsHistoryPage.jsx
import UserStatList from "../components/UserStatList";
import { useNavigate } from "react-router-dom";

const StatsHistoryPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <button onClick={() => navigate(-1)}>⬅ Retour</button>
      <UserStatList />
    </div>
  );
};

export default StatsHistoryPage;
