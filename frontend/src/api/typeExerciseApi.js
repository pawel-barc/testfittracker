import fetchWithRefresh from "./fetchWithRefresh";

const getTypeExercises = async () => {
  const response = await fetchWithRefresh(
    "http://localhost:8080/type-exercises",
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    }
  );
  return await response.json();
};

const addTypeExercise = async (values) => {
  const response = await fetchWithRefresh(
    "http://localhost:8080/type-exercises",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(values),
    }
  );
  return await response.json();
};

export { getTypeExercises, addTypeExercise };
