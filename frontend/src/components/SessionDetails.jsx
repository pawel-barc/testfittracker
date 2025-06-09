import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSessionExercises } from "../api/sessionExerciseApi";

const SessionDetails = () => {
   const [exercises, setExercises] = useState([]);

  useEffect(() => {
    getSessionExercises(id).then(setExercises).catch(console.error);
  }, [id]);

  return (
    <div>
      <h2>Détails de la séance</h2>
      <ul>
        {exercises.map((ex, i) => (
          <li key={i}>
            <strong>{ex.name}</strong> – {ex.sets}x{ex.reps} – {ex.duration} min
            – {ex.weight_used} kg – {ex.calories_burned} kcal
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SessionDetails;
