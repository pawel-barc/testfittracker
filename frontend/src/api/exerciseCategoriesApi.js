import fetchWithRefresh from "./fetchWithRefresh";

const getExerciseCategories = async () => {
  const response = await fetchWithRefresh(
    "http://localhost:8080/exercise-categories",
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    }
  );
  return await response.json();
};

const addExerciseCategory = async (values) => {
  const response = await fetchWithRefresh(
    "http://localhost:8080/exercise-categories",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(values),
    }
  );
  return await response.json();
};

export { getExerciseCategories, addExerciseCategory };
