import { useEffect, useState } from "react";
import { createSession } from "../api/sessionApi";
import { getExerciseCategories } from "../api/exerciseCategoriesApi";
import { getTypeExercises } from "../api/typeExerciseApi";
import { addSessionExercise } from "../api/sessionExerciseApi";
import ExerciseDetailsForm from "./ExerciseDetailsForm";
import sessionCategories from "../../public/sessionCategories.json";

const SessionWizard = ({ onFinish }) => {
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(0);
  const [notes, setNotes] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [error, setError] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [customExercise, setCustomExercise] = useState("");
  const [addedExercises, setAddedExercises] = useState([]);

  // Debug pour suivre sessionId
  useEffect(() => {
    console.log("SessionId changé:", sessionId);
  }, [sessionId]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getExerciseCategories();
        setCategories(data);
        console.log("Catégories chargées:", data); // Debug
      } catch (err) {
        console.error("Erreur de chargement des catégories");
      }
    };
    fetchCategories();
  }, []);

  // ✅ CORRECTION: Fonction pour trouver la catégorie DB correspondante
  const findMatchingCategory = (sessionCategory) => {
    if (!categories || categories.length === 0) {
      console.warn("Aucune catégorie DB chargée");
      return null;
    }

    // Recherche par nom (insensible à la casse)
    const matchByName = categories.find(cat => 
      cat.name.toLowerCase() === sessionCategory.name.toLowerCase()
    );
    
    if (matchByName) {
      console.log(`✅ Correspondance trouvée par nom: ${sessionCategory.name} -> ID ${matchByName.id}`);
      return matchByName;
    }

    // Recherche par correspondances connues
    const nameMapping = {
      'Back': ['Back', 'Dos', 'Dorsaux'],
      'Chest': ['Chest', 'Pectoraux', 'Pecs'],
      'Arms': ['Arms', 'Bras', 'Biceps', 'Triceps'],
      'Legs': ['Legs', 'Jambes', 'Quadriceps', 'Ischio'],
      'Shoulders': ['Shoulders', 'Épaules', 'Deltoïdes'],
      'Abs': ['Abs', 'Abdominaux', 'Core'],
      'Cardio': ['Cardio', 'Cardiovasculaire']
    };

    for (const [key, variants] of Object.entries(nameMapping)) {
      if (variants.some(variant => 
        variant.toLowerCase() === sessionCategory.name.toLowerCase()
      )) {
        const match = categories.find(cat => 
          variants.some(v => v.toLowerCase() === cat.name.toLowerCase())
        );
        if (match) {
          console.log(`✅ Correspondance trouvée par mapping: ${sessionCategory.name} -> ${match.name} (ID ${match.id})`);
          return match;
        }
      }
    }

    console.warn(`❌ Aucune correspondance trouvée pour: ${sessionCategory.name}`);
    console.log("Catégories disponibles:", categories.map(c => `${c.name} (ID: ${c.id})`));
    return null;
  };

  // ✅ CORRECTION: Gérer la sélection de catégorie correctement
  const handleCategorySelect = (sessionCategory) => {
    console.log("Catégorie sélectionnée:", sessionCategory);
    
    const dbCategory = findMatchingCategory(sessionCategory);
    
    if (dbCategory) {
      // Combiner les infos de sessionCategory (pour l'affichage) avec l'ID de la DB
      const combinedCategory = {
        ...sessionCategory,
        id: dbCategory.id,
        dbName: dbCategory.name
      };
      
      console.log("Catégorie finale:", combinedCategory);
      setSelectedCategory(combinedCategory);
      setStep(2);
    } else {
      alert(`❌ Erreur: Impossible de trouver la catégorie "${sessionCategory.name}" dans la base de données.`);
      console.error("Catégories disponibles:", categories);
    }
  };

  const handleSessionSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const now = new Date().toISOString();
      console.log("Création de session avec:", { title, duration, notes, date: now });
      
      const session = await createSession({
        title,
        duration,
        notes,
        date: now,
      });
      
      console.log("Réponse API session:", session);
      
      // ⚠️ CORRECTION : Gérer différents formats de retour API
      let sessionIdValue = null;
      
      if (session && typeof session === 'object') {
        // Cas 1: { id: 123, title: "...", ... }
        sessionIdValue = session.id;
        
        // Cas 2: { data: { id: 123, ... } }
        if (!sessionIdValue && session.data && session.data.id) {
          sessionIdValue = session.data.id;
        }
        
        // Cas 3: { session: { id: 123, ... } }
        if (!sessionIdValue && session.session && session.session.id) {
          sessionIdValue = session.session.id;
        }
      }
      
      // Cas 4: Retour direct de l'ID
      if (!sessionIdValue && typeof session === 'number') {
        sessionIdValue = session;
      }
      
      console.log("SessionId extrait:", sessionIdValue);
      
      if (sessionIdValue) {
        setSessionId(sessionIdValue);
        setStep(3);
      } else {
        console.error("Impossible d'extraire l'ID de session:", session);
        setError("Erreur: impossible de récupérer l'ID de la session créée");
      }
    } catch (err) {
      console.error("Erreur création session:", err);
      setError("Erreur lors de la création de la séance: " + err.message);
    }
  };

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        console.log("🔍 Début fetchExercises");
        console.log("📂 selectedCategory:", selectedCategory);
        console.log("📋 selectedCategory.id:", selectedCategory?.id);
        
        const all = await getTypeExercises();
        console.log("📦 Tous les exercices reçus:", all);
        console.log("📊 Nombre total d'exercices:", all?.length);
        
        if (!all || all.length === 0) {
          console.warn("⚠️ Aucun exercice retourné par l'API");
          setExercises([]);
          return;
        }
        
        // Debug des catégories dans les exercices
      const filtered = all.filter((exercise) => {
        // Compare les IDs en les convertissant tous deux en String pour éviter les problèmes de type
        const match = String(exercise.exercise_category_id) === String(selectedCategory.id);
        if (match) {
          console.log("✅ Exercice correspondant:", 
            exercise.name, 
            "category_id:", exercise.exercise_category_id,
            "Type:", typeof exercise.exercise_category_id,
            "vs selectedCat:", typeof selectedCategory.id
          );
        }
        return match;
      });
        
        console.log("🎯 Exercices filtrés:", filtered);
        console.log("📊 Nombre d'exercices filtrés:", filtered.length);
        
        setExercises(filtered);
        
      } catch (err) {
        console.error("💥 Erreur de chargement des exercices:", err);
        setExercises([]); // S'assurer qu'on a un tableau vide en cas d'erreur
      }
    };

    if (step === 3 && selectedCategory && selectedCategory.id) {
      console.log("🚀 Déclenchement fetchExercises - Step:", step, "Category:", selectedCategory);
      fetchExercises();
    }
  }, [step, selectedCategory]);

  const toggleExercise = (exercise) => {
    if (selectedExercises.find((e) => e.id === exercise.id)) {
      setSelectedExercises((prev) => prev.filter((e) => e.id !== exercise.id));
    } else {
      setSelectedExercises((prev) => [...prev, exercise]);
    }
  };

  const addCustomExercise = () => {
    if (customExercise.trim() !== "") {
      const custom = {
        id: `custom-${Date.now()}`,
        name: customExercise,
        isCustom: true,
      };
      setSelectedExercises((prev) => [...prev, custom]);
      setCustomExercise("");
    }
  };

  const handleSaveAll = async () => {
    try {
      // ⚠️ VÉRIFICATION CRITIQUE : S'assurer que sessionId existe
      if (!sessionId) {
        console.error("SessionId manquant:", sessionId);
        alert("❌ Erreur: Session non créée. Recommencez le processus.");
        setStep(1);
        return;
      }

      console.log("Début sauvegarde - SessionId:", sessionId);
      console.log("Exercices à sauvegarder:", addedExercises);

      for (const ex of addedExercises) {
        const exerciseData = {
          session_id: Number(sessionId), // ✅ CORRECTION: Forcer la conversion en nombre
          name: ex.name,
          sets: Number(ex.sets) || 0,     // ✅ CORRECTION: Convertir tous les nombres
          reps: Number(ex.reps) || 0,
          weight_used: Number(ex.weight_used) || 0,
          duration: Number(ex.duration) || 0,
          calories_burned: Number(ex.calories_burned) || 0,
          notes: ex.notes || "",
        };

        // ⚠️ CORRECTION : Gérer correctement les exercices personnalisés
        if (ex.isCustom || String(ex.id).startsWith('custom-')) {
          exerciseData.type_exercise_id = null;
        } else {
          exerciseData.type_exercise_id = Number(ex.id);
        }

        console.log("Envoi des données:", exerciseData);
        
        try {
          await addSessionExercise(exerciseData);
          console.log(`✅ Exercice "${ex.name}" ajouté avec succès`);
        } catch (exerciseError) {
          console.error(`❌ Erreur pour l'exercice "${ex.name}":`, exerciseError);
          throw exerciseError; // Relancer l'erreur pour arrêter le processus
        }
      }
      
      alert("✅ Séance enregistrée !");
      
      // Réinitialiser complètement
      setStep(1);
      setSelectedCategory(null);
      setTitle("");
      setDuration(0);
      setNotes("");
      setSessionId(null);
      setSelectedExercises([]);
      setAddedExercises([]);
      setCustomExercise("");
      setError(null);
      
      if (onFinish) {
        onFinish();
      }
      
    } catch (err) {
      console.error("Erreur détaillée lors de l'enregistrement:", err);
      
      // Afficher plus de détails sur l'erreur
      let errorMessage = "Erreur inconnue";
      if (err.response && err.response.data) {
        errorMessage = err.response.data.message || err.response.data.error || errorMessage;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      alert("❌ Erreur lors de l'enregistrement: " + errorMessage);
    }
  };

  if (step === 1) {
    return (
      <div className="session-wizard">
        <div className="session-wizard-close-button">
          <button onClick={onFinish} className="close-button">
            <img src="../../public/images/close-cross.png" alt="close cross" />
          </button>
        </div>

        <h2>NOUVELLE SEANCE</h2>
        <p>Étape 1/5</p>
        <h3>Veuillez choisir une catégorie :</h3>
        
        {/* ✅ AJOUT: Debug des catégories chargées */}
        {categories.length === 0 && (
          <div style={{ background: '#fff3cd', padding: '10px', margin: '10px 0' }}>
            ⚠️ Chargement des catégories en cours...
          </div>
        )}
        
        <div className="category-grid">
          {sessionCategories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => handleCategorySelect(cat)}
              className="category-button"
              disabled={categories.length === 0}
            >
              <img
                src={`../../public${cat.image}`}
                alt={cat.name}
                style={{ width: "50px", height: "50px", objectFit: "contain" }}
                className="category-icon"
              />
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="session-wizard-step2">
        <div className="session-wizard-close-button">
          <button onClick={onFinish} className="close-button">
            <img src="../../public/images/close-cross.png" alt="close cross" />
          </button>
        </div>
        <h2>NOUVELLE SEANCE</h2>
        <p>Étape 2/5</p>
        <p>
          Catégorie choisie : <strong>{selectedCategory.name}</strong>
          {selectedCategory.dbName && selectedCategory.dbName !== selectedCategory.name && (
            <span> (DB: {selectedCategory.dbName})</span>
          )}
        </p>
        <form onSubmit={handleSessionSubmit} className="session-form-step2">
          <label className="session-form-label">
            Titre:
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>
          <label className="session-form-label-border">
            Durée (minutes):
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              required
            />
          </label>
          <label className="session-form-label">
            Notes:
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </label>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button type="submit" className="next-step-button">Etape suivante</button>
        </form>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="session-wizard">
        <div className="session-wizard-close-button">
          <button onClick={onFinish} className="close-button">
            <img src="../../public/images/close-cross.png" alt="close cross" />
          </button>
        </div>
        <h2>NOUVELLE SEANCE</h2>
        <p>Etape 3/5</p>
        <p>SessionId: {sessionId}</p>
        
        {/* 🔍 SECTION DEBUG - AMÉLIORÉE */}
        <div style={{ background: '#f0f0f0', padding: '10px', margin: '10px 0', fontSize: '12px' }}>
          <strong>🐛 DEBUG INFO:</strong><br/>
          Category sélectionnée: {selectedCategory?.name} (ID: {selectedCategory?.id || 'MANQUANT!'})<br/>
          {selectedCategory?.dbName && <span>DB Name: {selectedCategory.dbName}<br/></span>}
          Nombre d'exercices chargés: {exercises.length}<br/>
          Step actuel: {step}<br/>
          Catégories DB disponibles: {categories.length}<br/>
          {!selectedCategory?.id && <span style={{color: 'red'}}>🚨 PROBLÈME: L'ID de catégorie est manquant!</span>}<br/>
          {exercises.length === 0 && selectedCategory?.id && <span style={{color: 'orange'}}>⚠️ Aucun exercice trouvé pour cette catégorie!</span>}
        </div>

        <h3>Ajouter des exercices</h3>
        <div className="exercise-selection">
          <div>
            <h3>Exercices suggérés :</h3>
            
            {/* Vérification de l'ID de catégorie d'abord */}
            {!selectedCategory?.id ? (
              <div style={{ padding: '20px', background: '#f8d7da', border: '1px solid #f5c6cb', color: '#721c24' }}>
                <p>🚨 <strong>ERREUR CRITIQUE:</strong> ID de catégorie manquant!</p>
                <p>La catégorie sélectionnée n'a pas d'ID valide.</p>
                <button onClick={() => setStep(1)} style={{ padding: '5px 10px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '3px' }}>
                  Retour à l'étape 1
                </button>
              </div>
            ) : exercises.length === 0 ? (
              <div style={{ padding: '20px', background: '#fff3cd', border: '1px solid #ffeaa7' }}>
                <p>🤔 Aucun exercice suggéré pour cette catégorie.</p>
                <p>Vérifiez que:</p>
                <ul>
                  <li>L'API getTypeExercises() fonctionne</li>
                  <li>Les exercices ont le bon exercise_category_id ({selectedCategory.id})</li>
                  <li>Des exercices existent pour cette catégorie</li>
                </ul>
              </div>
            ) : (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {exercises.map((exercise) => (
                  <button
                    key={exercise.id}
                    onClick={() => toggleExercise(exercise)}
                    style={{
                      backgroundColor: selectedExercises.find(
                        (e) => e.id === exercise.id
                      )
                        ? "#cce5ff"
                        : "#f8f9fa",
                      border: "1px solid #ccc",
                      padding: "5px 10px",
                      borderRadius: "4px",
                      cursor: "pointer"
                    }}
                  >
                    {exercise.name}
                    <small style={{ display: 'block', fontSize: '0.8em', opacity: 0.7 }}>
                      (ID: {exercise.id}, Cat: {exercise.exercise_category_id})
                    </small>
                  </button>
                ))}
              </div>
            )}
            
            <div style={{ margin: '20px 0' }}>
              <p><strong>Ou</strong></p>
              <h3>Ajoute ton propre exercice :</h3>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input
                  type="text"
                  value={customExercise}
                  onChange={(e) => setCustomExercise(e.target.value)}
                  placeholder="Nom de l'exercice"
                  style={{ padding: '8px', flex: 1 }}
                />
                <button 
                  onClick={addCustomExercise}
                  style={{ padding: '8px 15px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
                >
                  Ajouter
                </button>
              </div>
            </div>
          </div>
          
          <div style={{ marginTop: '20px' }}>
            <h4>Exercices sélectionnés :</h4>
            {selectedExercises.length === 0 ? (
              <p style={{ fontStyle: 'italic', color: '#666' }}>Aucun exercice sélectionné</p>
            ) : (
              <ul>
                {selectedExercises.map((ex) => (
                  <li key={ex.id} style={{ margin: '5px 0' }}>
                    {ex.name} {ex.isCustom ? "(perso)" : ""}
                    <button 
                      onClick={() => toggleExercise(ex)}
                      style={{ marginLeft: '10px', background: '#dc3545', color: 'white', border: 'none', padding: '2px 8px', borderRadius: '3px' }}
                    >
                      Retirer
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        
        <button 
          className="next-step-button" 
          onClick={() => setStep(4)}
          disabled={selectedExercises.length === 0}
          style={{ 
            marginTop: '20px',
            opacity: selectedExercises.length === 0 ? 0.5 : 1,
            cursor: selectedExercises.length === 0 ? 'not-allowed' : 'pointer'
          }}
        >
          Continuer {selectedExercises.length > 0 && `(${selectedExercises.length} exercices)`}
        </button>
      </div>
    );
  }

  if (step === 4) {
    console.log("Step 4 - SessionId actuel:", sessionId); // Debug
    return (
      <div className="session-wizard">
        <h2>Détails des exercices</h2>
        <p>SessionId: {sessionId}</p> {/* Debug temporaire */}
        <ExerciseDetailsForm
          selectedExercises={selectedExercises}
          addedExercises={addedExercises}
          setAddedExercises={setAddedExercises}
        />
        <button onClick={() => setStep(5)}>Suivant</button>
      </div>
    );
  }

  if (step === 5) {
    return (
      <div>
        <h3>✅ Résumé de la séance</h3>
        <p>SessionId: {sessionId}</p> {/* Debug temporaire */}
        <p>
          <strong>Titre:</strong> {title}
        </p>
        <p>
          <strong>Durée:</strong> {duration} min
        </p>
        <p>
          <strong>Notes:</strong> {notes}
        </p>

        <h4>📝 Exercices:</h4>
        <ul>
          {addedExercises.map((ex, idx) => (
            <li key={idx}>
              {ex.name} – séries: {ex.sets || 0}, répétitions: {ex.reps || 0},
              poids: {ex.weight_used || 0}kg
            </li>
          ))}
        </ul>

        <button onClick={handleSaveAll}>💾 Enregistrer la séance</button>
      </div>
    );
  }

  return null;
};

export default SessionWizard;