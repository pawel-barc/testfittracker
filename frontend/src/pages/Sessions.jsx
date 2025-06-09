import SessionWizard from "../components/SessionWizzard";
import '../style/Sessions.css';
import { useState, useEffect } from "react";
import { getSessions } from "../api/sessionApi"; // Vous devrez créer cette fonction API

const Sessions = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [showWizard, setShowWizard] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  

  // Fonction pour charger les séances
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setIsLoading(true);
        const data = await getSessions(); // Récupère les séances de l'utilisateur
        setSessions(data);
        setError(null);
      } catch (err) {
        console.error("Erreur lors du chargement des séances:", err);
        setError("Impossible de charger les séances");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, [refreshKey]); // Recharge quand refreshKey change

  const handleStartWizard = () => {
    setShowWizard(true);
  };

  const handleSessionCreated = () => {
    setShowWizard(false);
    setRefreshKey(prev => prev + 1); // Force le rechargement des séances
  };

  return (
    <div className="home-container">
      {!showWizard ? (
        <>
          <h2>MES SÉANCES</h2>
          
          {/* Affichage des séances */}
          {isLoading ? (
            <p>Chargement en cours...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : sessions.length === 0 ? (
            <p>Aucune séance enregistrée</p>
          ) : (
            <div className="sessions-list">
              {sessions.map(session => (
                <div key={session.id} className="session-card">
                  <h3>{session.title}</h3>
                  <p>Date: {new Date(session.date).toLocaleDateString()}</p>
                  <p>Durée: {session.duration} minutes</p>
                  <p>Exercices: {session.exercises?.length || 0}</p>
                  <button className="view-details-btn">Voir détails</button>
                </div>
              ))}
            </div>
          )}

          {/* Bouton d'ajout */}
          <div className="add-session-container">
            <h2>AJOUTER UNE NOUVELLE SÉANCE</h2>
            <button className="add-session-btn" onClick={handleStartWizard}>
              <img
                className="add-session-img"
                src="../../../public/images/add-session-icon.png"
                alt="Sessions Icon"
              />
            </button>
          </div>
        </>
      ) : (
        <SessionWizard onFinish={handleSessionCreated} />
      )}
    </div>
  );
}

export default Sessions;