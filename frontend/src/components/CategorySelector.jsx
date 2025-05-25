import { useEffect, useState } from "react";
import { getExerciseCategories } from "../api/exerciseCategoriesApi";

const CategorySelector = ({ onSelect }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getExerciseCategories().then(setCategories);
  }, []);

  return (
    <div className="category-grid">
      {categories.map((cat) => (
        <button
          key={cat.id}
          className="category-btn"
          onClick={() => onSelect(cat)}
        >
          <img src={`/icons/${cat.name}.svg`} alt={cat.name} />
          <span>{cat.name}</span>
        </button>
      ))}
    </div>
  );
};

export default CategorySelector;
