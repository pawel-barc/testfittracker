// src/api/session.js
import fetchWithRefresh from "./fetchWithRefresh";

const createSession = async ({ title, notes, duration, date }) => {
  const request = await fetchWithRefresh("http://localhost:8080/sessions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ title, notes, duration, date }),
  });
  return await request.json();
};

export { createSession };
