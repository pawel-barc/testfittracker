import fetchWithRefresh from "./fetchWithRefresh";

export const getGoals = async () => {
  const res = await fetchWithRefresh("http://localhost:8080/goals", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  return await res.json();
};

export const createGoal = async (data) => {
  const res = await fetchWithRefresh("http://localhost:8080/goals", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  return res.json();
};

export const deleteGoal = async (goalId) => {
  const res = await fetchWithRefresh(`http://localhost:8080/goals/${goalId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  return res.json();
};
