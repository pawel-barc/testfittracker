import { useState } from "react";
import { addSessionExercise } from "../api/sessionExerciseApi";

const AddSessionExerciseForm = ({ sessionId }) => {
  const [formData, setFormData] = useState({
    session_id: sessionId,
    type_exercise_id: "",
    name: "",
    sets: "",
    reps: "",
    weight_used: "",
    duration: "",
    calories_burned: "",
    notes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await addSessionExercise(formData);
      console.log("Exercice ajouté:", result);
      alert("Exercice ajouté !");
    } catch (error) {
      console.error("Erreur:", error);
      alert("Échec de l'ajout.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <label>
        ID de l'exercice (type_exercise_id):
        <input
          type="number"
          name="type_exercise_id"
          value={formData.type_exercise_id}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Nom personnalisé (facultatif):
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
      </label>

      <label>
        Séries:
        <input
          type="number"
          name="sets"
          value={formData.sets}
          onChange={handleChange}
        />
      </label>

      <label>
        Répétitions:
        <input
          type="number"
          name="reps"
          value={formData.reps}
          onChange={handleChange}
        />
      </label>

      <label>
        Poids utilisé (kg):
        <input
          type="number"
          name="weight_used"
          value={formData.weight_used}
          onChange={handleChange}
        />
      </label>

      <label>
        Durée (minutes):
        <input
          type="number"
          step="0.1"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
        />
      </label>

      <label>
        Calories brûlées:
        <input
          type="number"
          name="calories_burned"
          value={formData.calories_burned}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Notes:
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
        ></textarea>
      </label>

      <button type="submit">Ajouter l'exercice</button>
    </form>
  );
};

export default AddSessionExerciseForm;
