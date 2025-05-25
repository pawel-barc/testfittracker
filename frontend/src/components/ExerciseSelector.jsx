import { useEffect, useState } from "react";
import { getTypeExercises } from "../api/typeExerciseApi";

const ExerciseSelector = ({ categoryId, onSelect, onCustomName }) => {
  const [exercises, setExercises] = useState([]);
  const [customName, setCustomName] = useState("");

  useEffect(() => {
    getTypeExercises().then((data) => {
      const filtered = data.filter(
        (ex) => ex.exercise_category_id === categoryId
      );
      setExercises(filtered);
    });
  }, [categoryId]);

  return (
    <div>
      <h3>Choisissez un exercice</h3>
      <ul>
        {exercises.map((ex) => (
          <li key={ex.id}>
            <button onClick={() => onSelect(ex)}>{ex.name}</button>
          </li>
        ))}
      </ul>
      <div>
        <h4>Ou entrez votre propre exercice</h4>
        <input
          type="text"
          value={customName}
          onChange={(e) => setCustomName(e.target.value)}
          placeholder="Nom de l'exercice"
        />
        <button onClick={() => onCustomName(customName)}>Valider</button>
      </div>
    </div>
  );
};

export default ExerciseSelector;
