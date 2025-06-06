import AddUserStatForm from "../components/AddUserStatForm";
import UserStatList from "../components/UserStatList";
import GoalForm from "../components/GoalForm";
import GoalList from "../components/GoalList";
import Notifications from "../components/Notifications";
import { useState } from "react";

const Dashboard = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleStatAdded = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="user-stat-page">
      <hr />
      <AddUserStatForm onStatAdded={handleStatAdded} />
      <UserStatList key={refreshKey} />
      <hr />
      <GoalForm />
      <GoalList />
      <hr />
      <Notifications />
      <hr />


    </div>
  );
};

export default Dashboard;
