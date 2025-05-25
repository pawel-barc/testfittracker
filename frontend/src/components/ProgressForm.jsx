import { useState } from "react";
import { addProgress } from "../api/progressApi";

const ProgressForm = ({ goalId, onProgressAdded }) => {
  const [currentValue, setCurrentValue] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addProgress(goalId, currentValue);
      setCurrentValue("");
      onProgressAdded?.();
    } catch (err) {
      alert("Erreur lors de l'ajout du progrès: " + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Nouvelle valeur actuelle :</label>
      <input
        type="number"
        value={currentValue}
        onChange={(e) => setCurrentValue(e.target.value)}
        required
      />
      <button type="submit">Ajouter progrès</button>
    </form>
  );
};

export default ProgressForm;
