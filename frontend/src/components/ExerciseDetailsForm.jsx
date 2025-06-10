import { useState, useEffect, forwardRef, useImperativeHandle } from "react";

const ExerciseDetailsForm = forwardRef(
  ({ selectedExercises, addedExercises, setAddedExercises }, ref) => {
    const [formData, setFormData] = useState({});

    useEffect(() => {
      const initialData = {};
      selectedExercises.forEach((ex) => {
        initialData[ex.id] = {
          sets: 3,
          reps: 10,
          weight_used: 0,
          duration: 0,
          calories_burned: ex.calories_burned_per_min || 0,
          notes: "",
          name: ex.name,
          id: ex.id,
        };
      });
      setFormData(initialData);
    }, [selectedExercises]);

    const handleChange = (id, field, value) => {
      setFormData((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          [field]: value,
        },
      }));
    };

    // Exposer la fonction saveData au parent via useImperativeHandle
    useImperativeHandle(ref, () => ({
      saveData: () => {
        const toSave = Object.values(formData);
        setAddedExercises(toSave);
        return true; // Indique que la sauvegarde a réussi
      },
    }));

    return (
      <div>
        <div className="form-user-exercices">
          {selectedExercises.map((ex) => (
            <div key={ex.id} className="form-exercise-details">
              <h4>{ex.name}</h4>
              <div className="form-exercise-fields">
                <label>
                  Séries:
                  <input
                    type="number"
                    value={formData[ex.id]?.sets || 0}
                    onChange={(e) =>
                      handleChange(ex.id, "sets", parseInt(e.target.value))
                    }
                  />
                </label>
                <label>
                  Répétitions:
                  <input
                    type="number"
                    value={formData[ex.id]?.reps || 0}
                    onChange={(e) =>
                      handleChange(ex.id, "reps", parseInt(e.target.value))
                    }
                  />
                </label>
                <label>
                  Poids (kg):
                  <input
                    type="number"
                    value={formData[ex.id]?.weight_used || 0}
                    onChange={(e) =>
                      handleChange(ex.id, "weight_used", parseFloat(e.target.value))
                    }
                  />
                </label>
                <label>
                  Durée (min):
                  <input
                    type="number"
                    value={formData[ex.id]?.duration || 0}
                    onChange={(e) =>
                      handleChange(ex.id, "duration", parseFloat(e.target.value))
                    }
                  />
                </label>
                <label>
                  Notes:
                  <textarea
                    value={formData[ex.id]?.notes || ""}
                    onChange={(e) => handleChange(ex.id, "notes", e.target.value)}
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
);

export default ExerciseDetailsForm;
