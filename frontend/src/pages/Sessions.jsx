import SessionWizard from "../components/SessionWizzard";
import '../style/Sessions.css';
import { useState, useEffect } from "react";
import { getSessions } from "../api/sessionApi";
import sessionCategories from "../../public/sessionCategories.json";

// Composant Modal pour afficher les détails d'une session
const SessionModal = ({ session, onClose }) => {
  if (!session) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{session.title}</h2>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="session-info">
            <div className="info-item">
              <strong>Date :</strong> {new Date(session.date).toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
            
            <div className="info-item">
              <strong>Durée :</strong> {session.duration} minutes
            </div>
            
            {session.notes && (
              <div className="info-item">
                <strong>Notes :</strong>
                <p className="notes-content">{session.notes}</p>
              </div>
            )}
          </div>

          {/* Liste des exercices */}
          <div className="exercises-section">
            <h3>Exercices ({session.exercises?.length || 0})</h3>
            {session.exercises && session.exercises.length > 0 ? (
              <div className="exercises-list">
                {session.exercises.map((exercise, index) => (
                  <div key={exercise.id || index} className="exercise-card">
                    <div className="exercise-header">
                      <h4>{exercise.name || `Exercice ${index + 1}`}</h4>
                      {exercise.category && (
                        <span className="exercise-category">{exercise.category}</span>
                      )}
                    </div>
                    
                    <div className="exercise-details">
                      {exercise.sets && (
                        <div className="exercise-sets">
                          <strong>Séries :</strong>
                          <div className="sets-list">
                            {exercise.sets.map((set, setIndex) => (
                              <div key={setIndex} className="set-item">
                                <span>Série {setIndex + 1}:</span>
                                {set.reps && <span>{set.reps} reps</span>}
                                {set.weight && <span>{set.weight} kg</span>}
                                {set.duration && <span>{set.duration}s</span>}
                                {set.distance && <span>{set.distance}m</span>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {exercise.duration && !exercise.sets && (
                        <div><strong>Durée :</strong> {exercise.duration} secondes</div>
                      )}
                      
                      {exercise.reps && !exercise.sets && (
                        <div><strong>Répétitions :</strong> {exercise.reps}</div>
                      )}
                      
                      {exercise.weight && !exercise.sets && (
                        <div><strong>Poids :</strong> {exercise.weight} kg</div>
                      )}
                      
                      {exercise.distance && (
                        <div><strong>Distance :</strong> {exercise.distance} m</div>
                      )}
                      
                      {exercise.notes && (
                        <div className="exercise-notes">
                          <strong>Notes :</strong> {exercise.notes}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-exercises">Aucun exercice enregistré pour cette séance</p>
            )}
          </div>
        </div>
        
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Fermer</button>
        </div>
      </div>
    </div>
  );
};

const Sessions = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [showWizard, setShowWizard] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);

  // Fonction pour obtenir l'image de la catégorie basée sur sessionCategories.json
  const getCategoryImage = (session) => {
    console.log("🔍 getCategoryImage appelée pour:", session);
    console.log("📋 Structure de la session:", {
      id: session.id,
      title: session.title,
      category: session.category,
      exercises: session.exercises ? session.exercises.length : 0,
      firstExercise: session.exercises?.[0]
    });
    
    // Fonction pour trouver la catégorie correspondante
    const findCategoryMatch = (categoryName) => {
      console.log("🔎 findCategoryMatch cherche:", categoryName);
      if (!categoryName) return null;
      
      // Recherche directe par nom
      const directMatch = sessionCategories.find(cat => 
        cat.name.toLowerCase() === categoryName.toLowerCase()
      );
      if (directMatch) {
        console.log("✅ Correspondance directe trouvée:", directMatch);
        return directMatch;
      }
      
      // Mapping pour les correspondances courantes
      const nameMapping = {
        'back': ['back', 'dos', 'dorsaux'],
        'chest': ['chest', 'pectoraux', 'pecs'],
        'arms': ['arms', 'bras', 'biceps', 'triceps'],
        'legs': ['legs', 'jambes', 'quadriceps', 'ischio'],
        'shoulders': ['shoulders', 'épaules', 'deltoïdes'],
        'abs': ['abs', 'abdominaux', 'core'],
        'cardio': ['cardio', 'cardiovasculaire'],
        'running': ['running', 'course', 'courir'],
        'swimming': ['swimming', 'natation', 'nager'],
        'cycling': ['cycling', 'vélo', 'cyclisme'],
        'yoga': ['yoga'],
        'stretching': ['stretching', 'étirement', 'étirer'],
        'calves': ['calves', 'mollets']
      };
      
      // Recherche par mapping
      for (const sessionCat of sessionCategories) {
        const variants = nameMapping[sessionCat.name.toLowerCase()] || [sessionCat.name.toLowerCase()];
        if (variants.some(variant => variant === categoryName.toLowerCase())) {
          console.log("✅ Correspondance par mapping trouvée:", sessionCat, "pour", categoryName);
          return sessionCat;
        }
      }
      
      console.log("❌ Aucune correspondance trouvée pour:", categoryName);
      return null;
    };
    
    let categoryMatch = null;
    
    // 1. Vérifier si la session a des exercices avec catégorie
    if (session.exercises && session.exercises.length > 0) {
      const firstExercise = session.exercises[0];
      console.log("🏋️ Premier exercice:", firstExercise);
      if (firstExercise.category) {
        console.log("🎯 Tentative de match avec catégorie d'exercice:", firstExercise.category);
        categoryMatch = findCategoryMatch(firstExercise.category);
      }
    }
    
    // 2. Vérifier si la session a une catégorie directe
    if (!categoryMatch && session.category) {
      console.log("🎯 Tentative de match avec catégorie de session:", session.category);
      categoryMatch = findCategoryMatch(session.category);
    }
    
    // 3. Vérifier le titre de la session pour des indices de catégorie
    if (!categoryMatch && session.title) {
      console.log("🎯 Tentative de match avec titre de session:", session.title);
      const titleLower = session.title.toLowerCase();
      categoryMatch = sessionCategories.find(cat => {
        const match = titleLower.includes(cat.name.toLowerCase());
        if (match) {
          console.log("✅ Match trouvé dans le titre:", cat.name, "dans", session.title);
        }
        return match;
      });
    }
    
    // 4. Si toujours pas de match, essayer une recherche plus flexible
    if (!categoryMatch && session.title) {
      console.log("🔄 Recherche flexible dans le titre...");
      const titleWords = session.title.toLowerCase().split(/\s+/);
      categoryMatch = sessionCategories.find(cat => {
        return titleWords.some(word => 
          word === cat.name.toLowerCase() || 
          cat.name.toLowerCase().includes(word) ||
          word.includes(cat.name.toLowerCase())
        );
      });
      if (categoryMatch) {
        console.log("✅ Match flexible trouvé:", categoryMatch);
      }
    }
    
    // Retourner l'image trouvée ou une image par défaut
    if (categoryMatch) {
      const imagePath = `../../public${categoryMatch.image}`;
      console.log("🖼️ Image finale choisie:", imagePath);
      return imagePath;
    }
    
    console.log("🔄 Utilisation de l'image par défaut");
    // Image par défaut
    return "../../public/images/default-session-icon.png";
  };

  // Fonction pour charger les séances
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setIsLoading(true);
        const data = await getSessions();
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
  }, [refreshKey]);

  const handleStartWizard = () => {
    setShowWizard(true);
  };

  const handleSessionCreated = () => {
    setShowWizard(false);
    setRefreshKey(prev => prev + 1);
  };

  const handleViewDetails = (session) => {
    setSelectedSession(session);
  };

  const handleCloseModal = () => {
    setSelectedSession(null);
  };

  return (
    <div className="home-container">
      {!showWizard ? (
        <>
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
                  <button 
                    className="view-details-btn"
                    onClick={() => handleViewDetails(session)}
                  >
                    <img
                      className="category-icon"
                      src={getCategoryImage(session)}
                      alt={`Icône de catégorie`}
                      onError={(e) => {
                        // Image de fallback si l'image spécifique n'existe pas
                        e.target.src = "../../public/images/default-session-icon.png";
                      }}
                    />
                  </button>
                  <h3>{session.title}</h3>
                </div>
              ))}
            </div>
          )}

          {/* Bouton d'ajout */}
          <div className="add-session-container">
            <button className="add-session-btn" onClick={handleStartWizard}>
              <img
                className="add-session-img"
                src="../../public/images/add-session-icon.png"
                alt="Sessions Icon"
              />
            </button>
            <h2>AJOUTER UNE NOUVELLE SÉANCE</h2>
          </div>
        </>
      ) : (
        <SessionWizard onFinish={handleSessionCreated} />
      )}
      
      {/* Modale de détails */}
      {selectedSession && (
        <SessionModal 
          session={selectedSession} 
          onClose={handleCloseModal} 
        />
      )}
    </div>
  );
}

export default Sessions;