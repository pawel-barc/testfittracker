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

export const getSessions = async () => {
  try {
    const response = await fetch('/api/sessions'); // Adaptez l'URL à votre API
    if (!response.ok) {
      throw new Error('Erreur réseau');
    }
    return await response.json();
  } catch (error) {
    console.error("Erreur lors de la récupération des séances:", error);
    throw error;
  }
};

export { createSession };
