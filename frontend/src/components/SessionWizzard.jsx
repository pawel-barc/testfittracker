import { useEffect, useState } from "react";
import { createSession } from "../api/sessionApi";
import { getExerciseCategories } from "../api/exerciseCategoriesApi";
import { getTypeExercises } from "../api/typeExerciseApi";
import { addSessionExercise } from "../api/sessionExerciseApi";
import ExerciseDetailsForm from "./ExerciseDetailsForm";

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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getExerciseCategories();
        setCategories(data);
      } catch (err) {
        console.error("Erreur de chargement des catégories");
      }
    };
    fetchCategories();
  }, []);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setStep(2);
  };

  const handleSessionSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const now = new Date().toISOString();
      const session = await createSession({
        title,
        duration,
        notes,
        date: now,
      });
      setSessionId(session.id);
      setStep(3);
    } catch (err) {
      setError("Erreur lors de la création de la séance");
    }
  };

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const all = await getTypeExercises();
        const filtered = all.filter(
          (exercise) =>
            String(exercise.exercise_category_id) ===
            String(selectedCategory.id)
        );
        setExercises(filtered);
      } catch (err) {
        console.error("Erreur de chargement des exercices");
      }
    };

    if (step === 3 && selectedCategory) {
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
      for (const ex of addedExercises) {
        await addSessionExercise({
          session_id: sessionId,
          type_exercise_id: ex.id,
          name: ex.name,
          sets: ex.sets,
          reps: ex.reps,
          weight_used: ex.weight_used,
          duration: ex.duration,
          calories_burned: ex.calories_burned,
          notes: ex.notes,
        });
      }
      alert("✅ Séance enregistrée !");
      setStep(1);
    } catch (err) {
      console.error(err);
      alert("❌ Erreur lors de l'enregistrement.");
    }
  };

  if (step === 1) {
    return (
      <div>
        <h2>Choisis une catégorie</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat)}
              style={{
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>
        <br />
        <button onClick={onFinish}>Annuler</button>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div>
        <h2>Créer une séance</h2>
        <p>
          Catégorie choisie : <strong>{selectedCategory.name}</strong>
        </p>
        <form onSubmit={handleSessionSubmit}>
          <label>
            Titre:
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>
          <br />
          <label>
            Durée (minutes):
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              required
            />
          </label>
          <br />
          <label>
            Notes:
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </label>
          <br />
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button type="submit">Continuer</button>
          <button type="button" onClick={onFinish}>
            Annuler
          </button>
        </form>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div>
        <h2>Ajouter des exercices</h2>
        <p>Catégorie : {selectedCategory.name}</p>
        <p>ID de la séance : {sessionId}</p>

        <h3>Exercices suggérés :</h3>
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
              }}
            >
              {exercise.name}
            </button>
          ))}
        </div>

        <h3>Ou ajoute ton propre exercice :</h3>
        <input
          type="text"
          value={customExercise}
          onChange={(e) => setCustomExercise(e.target.value)}
          placeholder="Nom de l'exercice"
        />
        <button onClick={addCustomExercise}>Ajouter</button>

        <h4>Exercices sélectionnés :</h4>
        <ul>
          {selectedExercises.map((ex) => (
            <li key={ex.id}>
              {ex.name} {ex.isCustom ? "(perso)" : ""}
            </li>
          ))}
        </ul>

        <button onClick={() => setStep(4)}>Continuer</button>
        <button onClick={onFinish}>Annuler</button>
      </div>
    );
  }

  if (step === 4) {
    return (
      <div>
        <h2>Détails des exercices</h2>
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
