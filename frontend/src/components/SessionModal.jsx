import React, { useState, useEffect } from 'react';
import { getSessionExercises } from '../api/sessionExerciseApi';
import { deleteSession } from '../api/sessionApi'; // ✅ Import de la fonction de suppression
import '../style/SessionModal.css';

const SessionModal = ({ session, onClose, onSessionDeleted }) => {
  const [exercises, setExercises] = useState([]);
  const [isLoadingExercises, setIsLoadingExercises] = useState(true);
  const [exercisesError, setExercisesError] = useState(null);
  
  // ✅ NOUVEAUX ÉTATS pour la suppression
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Charger les exercices de la session
  useEffect(() => {
    const fetchExercises = async () => {
      if (!session?.id) {
        console.error("❌ ID de session manquant");
        setIsLoadingExercises(false);
        return;
      }

      try {
        console.log("🔍 Chargement des exercices pour la session:", session.id);
        setIsLoadingExercises(true);
        setExercisesError(null);
        
        const exercisesData = await getSessionExercises(session.id);
        console.log("✅ Exercices chargés:", exercisesData);
        
        // Vérifier si exercisesData est un tableau
        if (Array.isArray(exercisesData)) {
          setExercises(exercisesData);
        } else if (exercisesData && Array.isArray(exercisesData.data)) {
          setExercises(exercisesData.data);
        } else {
          console.warn("⚠️ Format d'exercices inattendu:", exercisesData);
          setExercises([]);
        }
      } catch (error) {
        console.error("💥 Erreur lors du chargement des exercices:", error);
        setExercisesError("Impossible de charger les exercices");
        setExercises([]);
      } finally {
        setIsLoadingExercises(false);
      }
    };

    fetchExercises();
  }, [session?.id]);

  // ✅ NOUVELLE FONCTION : Gérer la suppression
  const handleDeleteSession = async () => {
    if (!session?.id) {
      console.error("❌ Impossible de supprimer : ID de session manquant");
      return;
    }

    try {
      setIsDeleting(true);
      console.log("🗑️ Suppression de la session:", session.id);
      
      await deleteSession(session.id);
      
      console.log("✅ Session supprimée avec succès");
      
      // Notifier le parent que la session a été supprimée
      if (onSessionDeleted) {
        onSessionDeleted(session.id);
      }
      
      // Fermer la modal
      onClose();
      
    } catch (error) {
      console.error("💥 Erreur lors de la suppression:", error);
      alert("Erreur lors de la suppression de la session. Veuillez réessayer.");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  // Fermer la modal en cliquant sur l'overlay
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !showDeleteConfirm) {
      onClose();
    }
  };

  // ✅ CORRECTION : Formater la date - utilise uniquement 'date'
  const formatDate = (dateString) => {
    if (!dateString) return 'Date non définie';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch (error) {
      return 'Date invalide';
    }
  };

  // Formater la durée (en minutes)
  const formatDuration = (duration) => {
    if (!duration || duration === 0) return 'Non définie';
    // La durée est maintenant stockée en minutes
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    
    if (hours > 0) {
      return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`;
    } else {
      return `${minutes}min`;
    }
  };

  if (!session) return null;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        {/* En-tête */}
        <div className="modal-header">
          <h2>{session.title || 'Séance sans titre'}</h2>
          <button className="modal-close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        {/* Corps de la modal */}
        <div className="modal-body">
          {/* Informations de la session */}
          <div className="session-info">
            <div className="info-item">
              <div>
                <strong>Date :</strong>
                {/* ✅ CORRECTION : Utilise uniquement session.date */}
                <span>{formatDate(session.date)}</span>
              </div>
              <div>
                <strong>Durée :</strong>
                <span>{formatDuration(session.duration)}</span>
              </div>
            </div>

            <div className="info-item">
              <div>
                <strong>Catégorie :</strong>
                <span className="category-badge">
                  {session.category || 'Non définie'}
                </span>
              </div>
              <div>
                <strong>Calories brûlées :</strong>
                <span>{session.calories_burned || 0} cal</span>
              </div>
            </div>

            {session.notes && (
              <div className="info-item">
                <div style={{ gridColumn: '1 / -1' }}>
                  <strong>Notes :</strong>
                  <div className="notes-content">{session.notes}</div>
                </div>
              </div>
            )}
          </div>

          {/* Section des exercices */}
          <div className="exercises-section">
            <h3>Exercices ({exercises.length})</h3>
            
            {isLoadingExercises ? (
              <div className="loading-message">
                <p>Chargement des exercices...</p>
              </div>
            ) : exercisesError ? (
              <div className="error-message">
                <p>{exercisesError}</p>
              </div>
            ) : exercises.length === 0 ? (
              <div className="no-exercises">
                <p>Aucun exercice enregistré pour cette séance</p>
              </div>
            ) : (
              <div className="exercises-list">
                {exercises.map((exercise, index) => (
                  <div key={exercise.id || index} className="exercise-card">
                    <div className="exercise-header">
                      <h4>{exercise.name || 'Exercice sans nom'}</h4>
                      {exercise.category && (
                        <span className="exercise-category">
                          {exercise.category}
                        </span>
                      )}
                    </div>
                    
                    <div className="exercise-details">
                      {exercise.sets > 0 && (
                        <div>
                          <strong>Séries :</strong> {exercise.sets}
                        </div>
                      )}
                      
                      {exercise.reps > 0 && (
                        <div>
                          <strong>Répétitions :</strong> {exercise.reps}
                        </div>
                      )}
                      
                      {exercise.weight_used > 0 && (
                        <div>
                          <strong>Poids :</strong> {exercise.weight_used} kg
                        </div>
                      )}
                      
                      {exercise.duration > 0 && (
                        <div>
                          <strong>Durée :</strong> {formatDuration(exercise.duration)}
                        </div>
                      )}
                      
                      {exercise.calories_burned > 0 && (
                        <div>
                          <strong>Calories :</strong> {exercise.calories_burned} cal
                        </div>
                      )}
                    </div>

                    {exercise.notes && (
                      <div className="exercise-notes">
                        <strong>Notes :</strong> {exercise.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ✅ NOUVELLE SECTION : Confirmation de suppression */}
        {showDeleteConfirm && (
          <div className="delete-confirm-overlay">
            <div className="delete-confirm-dialog">
              <h3>Confirmer la suppression</h3>
              <p>Êtes-vous sûr de vouloir supprimer cette séance ?</p>
              <p><strong>Cette action est irréversible.</strong></p>
              <div className="delete-confirm-actions">
                <button 
                  className="btn-secondary" 
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                >
                  Annuler
                </button>
                <button 
                  className="btn-danger" 
                  onClick={handleDeleteSession}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Suppression...' : 'Supprimer'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pied de page */}
        <div className="modal-footer">
          {/* ✅ MODIFICATION : Bouton suppression conditionnel */}
          {!showDeleteConfirm && (
            <button 
              className="btn-danger" 
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isDeleting}
            >
              {isDeleting ? 'Suppression...' : 'Supprimer la séance'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionModal;