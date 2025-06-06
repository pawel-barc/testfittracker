import SessionWizard from "../components/SessionWizzard";
import '../style/Sessions.css';
import { useState } from "react";




const Sessions = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const handleStartWizard = () => {
  setShowWizard(true);
};
  const [showWizard, setShowWizard] = useState(false);

return (
  <div className="home-container">
        {!showWizard && (
          <button className='add-session-btn' onClick={handleStartWizard}>
            <img className='add-session-img' src="../../../src/assets/images/add-session-icon.png " alt="Sessions Icon" />
          </button>
        )}
        {showWizard && <SessionWizard onFinish={() => setShowWizard(false)} />}
      
  </div>
);
}

export default Sessions;