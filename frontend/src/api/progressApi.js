import fetchWithRefresh from "./fetchWithRefresh";

export const addProgress = async (goalId, currentValue) => {
  const response = await fetchWithRefresh("http://localhost:8080/progress", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      goal_id: goalId,
      current_value: parseFloat(currentValue),
    }),
    credentials: "include",
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data?.error || "Échec de l'ajout du progrès");
  }

  return response.json();
};

export const getProgressForGoal = async (goalId) => {
  const response = await fetchWithRefresh(
    `http://localhost:8080/progress/${goalId}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    }
  );

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data?.error || "Échec de récupération du progrès");
  }

  return response.json();
};
