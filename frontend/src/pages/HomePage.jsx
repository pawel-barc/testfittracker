import AddUserStatForm from "../components/AddUserStatForm";
import UserStatList from "../components/UserStatList";
import GoalForm from "../components/GoalForm";
import GoalList from "../components/GoalList";
import Login from "./Login";
import Notifications from "../components/Notifications";
import { useState } from "react";
import SessionWizard from "../components/SessionWizzard";

const HomePage = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [showWizard, setShowWizard] = useState(false);

  const handleStatAdded = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleStartWizard = () => {
    setShowWizard(true);
  };

  return (
    <div className="user-stat-page">
      <Login />
      <hr />
      <AddUserStatForm onStatAdded={handleStatAdded} />
      <UserStatList key={refreshKey} />
      <hr />
      <GoalForm />
      <GoalList />
      <hr />
      <Notifications />
      <hr />

      <div>
        {!showWizard && (
          <button onClick={handleStartWizard}>➕ Ajouter une séance</button>
        )}
        {showWizard && <SessionWizard onFinish={() => setShowWizard(false)} />}
      </div>
    </div>
  );
};

export default HomePage;
