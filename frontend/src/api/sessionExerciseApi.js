import fetchWithRefresh from "./fetchWithRefresh";

const addSessionExercise = async (values) => {
  const response = await fetchWithRefresh(
    "http://localhost:8080/session-exercises",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
      credentials: "include",
    }
  );
  return response.json();
};

const getSessionExercises = async (sessionId) => {
  const response = await fetchWithRefresh(
    `http://localhost:8080/session-exercise/${sessionId}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    }
  );
  return response.json();
};

export { addSessionExercise, getSessionExercises };
