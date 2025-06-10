// components/GoalForm.jsx
import { useState } from "react";
import { createGoal } from "../api/goalsApi";
import { useNavigate } from "react-router-dom";
import "../style/GoalForm.css";

const GoalForm = ({ onCreated }) => {
  const [title, setTitle] = useState("");
  const [initialValue, setInitialValue] = useState("");
  const [target, setTarget] = useState("");
  const [status, setStatus] = useState("active");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createGoal({
        title,
        status,
        start_date: startDate,
        end_date: endDate,
        target: parseFloat(target),
        initial_value: parseFloat(initialValue),
      });
      
      // Afficher un message de confirmation
      alert("Objectif ajouté avec succès !");
      
      // Rediriger vers le dashboard
      navigate("/dashboard");
      
      // Appeler le callback si fourni
      onCreated?.();
    } catch (error) {
      console.error("Erreur lors de la création de l'objectif:", error);
      alert("Une erreur est survenue lors de la création de l'objectif.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="goal-form">
      <label>Titre</label>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <label>Valeur initiale</label>
      <input
        type="number"
        value={initialValue}
        onChange={(e) => setInitialValue(e.target.value)}
        required
      />

      <label>Objectif</label>
      <input
        type="number"
        value={target}
        onChange={(e) => setTarget(e.target.value)}
        required
      />

      <label>Date de début</label>
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        required
      />

      <label>Date de fin</label>
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        required
      />

      <button type="submit">Sauvegarder</button>
    </form>
  );
};

export default GoalForm;