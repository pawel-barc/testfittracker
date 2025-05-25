import { useState, useEffect } from "react";
import CategorySelector from "./CategorySelector";
import ExerciseSelector from "./ExerciseSelector";
import ExerciseDetailsForm from "./ExerciseDetailsForm";

const AddExerciseWizard = ({ sessionId }) => {
  const [category, setCategory] = useState(null);
  const [exercise, setExercise] = useState(null);
  const [customName, setCustomName] = useState(null);

  if (!category) {
    return <CategorySelector onSelect={setCategory} />;
  }

  if (!exercise && !customName) {
    return (
      <ExerciseSelector
        categoryId={category.id}
        onSelect={setExercise}
        onCustomName={setCustomName}
      />
    );
  }

  return (
    <ExerciseDetailsForm
      sessionId={sessionId}
      typeExerciseId={exercise?.id ?? null}
      name={customName ?? exercise?.name}
      onDone={() => {
        alert("Exercice ajouté !");
        setCategory(null);
        setExercise(null);
        setCustomName(null);
      }}
    />
  );
};

export default AddExerciseWizard;
