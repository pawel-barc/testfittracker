import SessionWizard from "../components/SessionWizzard";
import '../style/Sessions.css';
import { useState, useEffect } from "react";
import { getSessions } from "../api/sessionApi";
import sessionCategories from "../sessionCategories.json";
import SessionModal from "../components/SessionModal";

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
    // return "/images/default-session-icon.png";
  };

  // Fonction pour trier les sessions par date décroissante (plus récente en premier)
const sortSessionsByDate = (sessionsArray) => {
  return [...sessionsArray].sort((a, b) => {
    return b.id - a.id; // Tri décroissant par ID
  });
};

  // Fonction pour charger les séances
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setIsLoading(true);
        const data = await getSessions();
        // Trier les sessions par date décroissante
        const sortedSessions = sortSessionsByDate(data);
        setSessions(sortedSessions);
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

  // Fonction appelée après suppression d'une session
  const handleSessionDeleted = () => {
    setSelectedSession(null);
    setRefreshKey(prev => prev + 1); // Recharger la liste des sessions
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
            <p>(Aucune séance enregistrée)</p>
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
                      src={getCategoryImage(session) || '/images/session-placeholder.png'}
                      alt={`Icône de catégorie`}
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
                src="/images/add-session-icon.png"
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
          onSessionDeleted={handleSessionDeleted}
        />
      )}
    </div>
  );
}

export default Sessions;