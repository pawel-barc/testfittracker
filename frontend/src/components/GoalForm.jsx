// components/GoalForm.jsx
import { useState } from "react";
import { createGoal } from "../api/goalsApi";

const GoalForm = ({ onCreated }) => {
  const [title, setTitle] = useState("");
  const [initialValue, setInitialValue] = useState("");
  const [target, setTarget] = useState("");
  const [status, setStatus] = useState("active");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await createGoal({
      title,
      status,
      start_date: startDate,
      end_date: endDate,
      target: parseFloat(target),
      initial_value: parseFloat(initialValue),
    });
    onCreated?.(result);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Nouvel objectif</h2>

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

      <label>Objectif (target)</label>
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
