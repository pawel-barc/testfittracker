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
    console.log("SessionId changé:", sessionId, typeof sessionId);
  }, [sessionId]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getExerciseCategories();
        setCategories(data);
        console.log("Catégories chargées:", data);
      } catch (err) {
        console.error("Erreur de chargement des catégories");
      }
    };
    fetchCategories();
  }, []);

  const findMatchingCategory = (sessionCategory) => {
    if (!categories || categories.length === 0) {
      console.warn("Aucune catégorie DB chargée");
      return null;
    }

    const matchByName = categories.find(cat => 
      cat.name.toLowerCase() === sessionCategory.name.toLowerCase()
    );
    
    if (matchByName) {
      console.log(`✅ Correspondance trouvée par nom: ${sessionCategory.name} -> ID ${matchByName.id}`);
      return matchByName;
    }

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

  const handleCategorySelect = (sessionCategory) => {
    console.log("Catégorie sélectionnée:", sessionCategory);
    
    const dbCategory = findMatchingCategory(sessionCategory);
    
    if (dbCategory) {
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

  // ✅ CORRECTION PRINCIPALE : Améliorer la gestion de la création de session
  const handleSessionSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    try {
      const now = new Date().toISOString();
      console.log("🚀 Création de session avec:", { title, duration, notes, date: now });
      
      const sessionResponse = await createSession({
        title,
        duration,
        notes,
        date: now,
      });
      
      console.log("📦 Réponse complète API session:", sessionResponse);
      console.log("📊 Type de réponse:", typeof sessionResponse);
      
      // ✅ EXTRACTION PLUS ROBUSTE DE L'ID
      let extractedSessionId = null;
      
      // Cas 1: Réponse directe avec ID
      if (typeof sessionResponse === 'number' && sessionResponse > 0) {
        extractedSessionId = sessionResponse;
        console.log("✅ Cas 1: ID direct:", extractedSessionId);
      }
      // Cas 2: Objet avec propriété id
      else if (sessionResponse && typeof sessionResponse === 'object') {
        if (sessionResponse.id && Number.isInteger(Number(sessionResponse.id))) {
          extractedSessionId = Number(sessionResponse.id);
          console.log("✅ Cas 2: session.id:", extractedSessionId);
        }
        // Cas 3: Objet imbriqué session.data.id
        else if (sessionResponse.data && sessionResponse.data.id) {
          extractedSessionId = Number(sessionResponse.data.id);
          console.log("✅ Cas 3: session.data.id:", extractedSessionId);
        }
        // Cas 4: Objet imbriqué session.session.id
        else if (sessionResponse.session && sessionResponse.session.id) {
          extractedSessionId = Number(sessionResponse.session.id);
          console.log("✅ Cas 4: session.session.id:", extractedSessionId);
        }
        // Cas 5: Propriété insertId (MySQL)
        else if (sessionResponse.insertId) {
          extractedSessionId = Number(sessionResponse.insertId);
          console.log("✅ Cas 5: insertId:", extractedSessionId);
        }
      }
      
      console.log("🎯 ID final extrait:", extractedSessionId, typeof extractedSessionId);
      
      // ✅ VALIDATION STRICTE DE L'ID
      if (!extractedSessionId || isNaN(extractedSessionId) || extractedSessionId <= 0) {
        console.error("❌ ID de session invalide:", extractedSessionId);
        console.error("📋 Structure complète de la réponse:", JSON.stringify(sessionResponse, null, 2));
        
        // Afficher un message d'erreur détaillé
        setError(`❌ Erreur: Impossible d'extraire l'ID de la session.
        Réponse API reçue: ${JSON.stringify(sessionResponse)}
        Vérifiez la structure de retour de votre API createSession().`);
        return;
      }
      
      // ✅ SUCCÈS : Sauvegarder l'ID et continuer
      setSessionId(extractedSessionId);
      console.log("🎉 Session créée avec succès, ID:", extractedSessionId);
      setStep(3);
      
    } catch (err) {
      console.error("💥 Erreur création session:", err);
      
      let errorMessage = "Erreur lors de la création de la séance";
      
      if (err.response) {
        // Erreur HTTP avec réponse
        errorMessage += `: ${err.response.status} - ${err.response.data?.message || err.response.statusText}`;
      } else if (err.message) {
        // Erreur JavaScript
        errorMessage += `: ${err.message}`;
      }
      
      setError(errorMessage);
      console.error("📋 Détails de l'erreur:", err);
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
        
        const filtered = all.filter((exercise) => {
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
        setExercises([]);
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

  // ✅ FONCTION HANDLEAVEALL AVEC VÉRIFICATIONS RENFORCÉES
  const handleSaveAll = async () => {
    try {
      console.log("🚀 === DÉBUT SAUVEGARDE ===");
      console.log("🔍 Vérification de sessionId:", sessionId, typeof sessionId);
      
      // ✅ VÉRIFICATION CRITIQUE RENFORCÉE
      if (!sessionId || isNaN(Number(sessionId)) || Number(sessionId) <= 0) {
        console.error("❌ SessionId invalide:", sessionId);
        alert(`❌ Erreur critique: Session ID invalide (${sessionId}). 
        La session n'a pas été créée correctement. 
        Veuillez recommencer le processus.`);
        
        // Retour forcé à l'étape 1
        setStep(1);
        setSessionId(null);
        return;
      }

      const validSessionId = Number(sessionId);
      console.log("✅ SessionId validé:", validSessionId);
      console.log("📋 Exercices à sauvegarder:", addedExercises);
      console.log("📊 Nombre d'exercices:", addedExercises.length);

      if (addedExercises.length === 0) {
        alert("⚠️ Aucun exercice à sauvegarder");
        return;
      }

      // ✅ AJOUT D'UNE VÉRIFICATION DE SESSION AVANT SAUVEGARDE
      console.log("🔍 Tentative de sauvegarde avec session_id:", validSessionId);

      for (const [index, ex] of addedExercises.entries()) {
        console.log(`\n📝 === EXERCICE ${index + 1}/${addedExercises.length} ===`);
        console.log("🏷️ Exercice brut:", ex);
        
        // ✅ CONSTRUCTION DES DONNÉES AVEC VALIDATION STRICTE
        const exerciseData = {
          session_id: validSessionId, // Utiliser l'ID validé
          name: String(ex.name || '').trim(),
          sets: Number(ex.sets) || 0,
          reps: Number(ex.reps) || 0,
          weight_used: Number(ex.weight_used) || 0,
          duration: Number(ex.duration) || 0,
          calories_burned: Number(ex.calories_burned) || 0,
          notes: String(ex.notes || '').trim(),
        };

        // ⚠️ GESTION DES EXERCICES PERSONNALISÉS
        if (ex.isCustom || String(ex.id).startsWith('custom-')) {
          exerciseData.type_exercise_id = null;
          console.log("🎨 Exercice personnalisé détecté");
        } else {
          exerciseData.type_exercise_id = Number(ex.id);
          console.log("🏋️ Exercice type ID:", exerciseData.type_exercise_id);
        }

        console.log("📤 Données finales à envoyer:", exerciseData);
        
        // ✅ VALIDATION AVANT ENVOI
        if (!exerciseData.name) {
          console.error("❌ Nom d'exercice manquant");
          alert(`❌ Erreur: Le nom de l'exercice ${index + 1} est manquant`);
          return;
        }
        
        try {
          console.log("🚀 Envoi vers addSessionExercise...");
          const result = await addSessionExercise(exerciseData);
          console.log(`✅ Exercice "${ex.name}" ajouté avec succès:`, result);
          
        } catch (exerciseError) {
          console.error(`💥 Erreur pour l'exercice "${ex.name}":`, exerciseError);
          
          // ✅ GESTION DÉTAILLÉE DE L'ERREUR
          let userMessage = `Erreur lors de l'ajout de "${ex.name}"`;
          
          if (exerciseError.message && exerciseError.message.includes("La session spécifiée n'existe pas")) {
            userMessage = `❌ ERREUR CRITIQUE: La session ${validSessionId} n'existe pas en base de données.
            
            Cela peut indiquer:
            - La session n'a pas été créée correctement
            - Un problème de synchronisation avec la base de données
            - Un conflit d'ID
            
            Veuillez recommencer le processus complet.`;
            
            // Retour forcé à l'étape 1 en cas d'erreur de session
            alert(userMessage);
            setStep(1);
            setSessionId(null);
            return;
          }
          
          if (exerciseError.status === 400) {
            console.error("📋 Erreur 400 - Bad Request");
            
            if (exerciseError.data) {
              if (typeof exerciseError.data === 'string') {
                userMessage += `: ${exerciseError.data}`;
              } else if (exerciseError.data.message) {
                userMessage += `: ${exerciseError.data.message}`;
              } else if (exerciseError.data.error) {
                userMessage += `: ${exerciseError.data.error}`;
              } else {
                userMessage += `: ${JSON.stringify(exerciseError.data)}`;
              }
            }
          }
          
          alert(`❌ ${userMessage}`);
          throw exerciseError;
        }
      }
      
      console.log("🎉 Tous les exercices ont été ajoutés avec succès !");
      alert("✅ Séance enregistrée avec succès !");
      
      // ✅ RÉINITIALISATION COMPLÈTE
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
        console.log("🔄 Appel onFinish()");
        onFinish();
      }
      
    } catch (err) {
      console.error("💥 Erreur critique lors de l'enregistrement:", err);
      
      let errorMessage = "Erreur inconnue lors de l'enregistrement";
      
      if (err.message && err.message.includes("La session spécifiée n'existe pas")) {
        errorMessage = "❌ La session n'existe pas en base de données. Veuillez recommencer.";
        setStep(1);
        setSessionId(null);
      } else if (err.status === 400) {
        errorMessage = "Erreur 400: Données invalides envoyées au serveur";
      } else if (err.status === 401) {
        errorMessage = "Erreur 401: Non autorisé (vérifiez votre connexion)";
      } else if (err.status === 500) {
        errorMessage = "Erreur 500: Erreur serveur interne";
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      alert(`❌ ${errorMessage}`);
      console.log("⚠️ Sauvegarde échouée, état conservé pour correction");
    }
  };

  // ✅ FONCTION DE DEBUG AMÉLIORÉE
  const debugSessionData = () => {
    console.log("🐛 === DEBUG SESSION DATA ===");
    console.log("SessionId:", sessionId);
    console.log("Type sessionId:", typeof sessionId);
    console.log("SessionId valide?", !isNaN(Number(sessionId)) && Number(sessionId) > 0);
    console.log("AddedExercises:", addedExercises);
    console.log("Nombre d'exercices:", addedExercises.length);
    
    if (addedExercises.length > 0) {
      console.log("Premier exercice:", addedExercises[0]);
      console.log("Clés du premier exercice:", Object.keys(addedExercises[0]));
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
          {error && (
            <div style={{ 
              color: "red", 
              background: "#f8d7da", 
              padding: "10px", 
              border: "1px solid #f5c6cb",
              borderRadius: "4px",
              margin: "10px 0"
            }}>
              {error}
            </div>
          )}
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
        
        {/* 🔍 SECTION DEBUG - AMÉLIORÉE */}
        <div style={{ background: '#f0f0f0', padding: '10px', margin: '10px 0', fontSize: '12px' }}>
          <strong>🐛 DEBUG INFO:</strong><br/>
          SessionId: {sessionId} (Type: {typeof sessionId})<br/>
          SessionId valide: {!isNaN(Number(sessionId)) && Number(sessionId) > 0 ? "✅ OUI" : "❌ NON"}<br/>
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
    console.log("Step 4 - SessionId actuel:", sessionId);
    return (
      <div className="session-wizard">
        <h2>Détails des exercices</h2>
        <div style={{ background: '#f0f0f0', padding: '10px', margin: '10px 0', fontSize: '12px' }}>
          <strong>🐛 Step 4 DEBUG:</strong> SessionId: {sessionId} (Type: {typeof sessionId})
        </div>
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