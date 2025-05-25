import { useState } from "react";
import { addUserStat } from "../api/userStatsApi";

function AddUserStatForm({ onStatAdded }) {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bodyFat, setBodyFat] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await addUserStat({
        weight: parseFloat(weight),
        height: parseFloat(height),
        body_fat_percentage: bodyFat ? parseFloat(bodyFat) : undefined,
      });

      if (response.error) {
        setError(response.error);
      } else {
        setSuccess("Statistiques sauvegardés!");
        setWeight("");
        setHeight("");
        setBodyFat("");
        onStatAdded();
      }
    } catch (err) {
      setError("Erreur serveur");
    }
  };

  return (
    <form className="stat-form" onSubmit={handleSubmit}>
      <h2>Ajout statistiques</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <label>Poids (kg)</label>
      <input
        type="number"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        required
      />

      <label>Taille (cm)</label>
      <input
        type="number"
        value={height}
        onChange={(e) => setHeight(e.target.value)}
        required
      />

      <label>Fat % (Option)</label>
      <input
        type="number"
        value={bodyFat}
        onChange={(e) => setBodyFat(e.target.value)}
        min={3}
        max={60}
      />

      <button type="submit">Confirmer</button>
    </form>
  );
}

export default AddUserStatForm;
