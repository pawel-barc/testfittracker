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
    // ✅ CORRECTION: Utiliser la même base URL et fetchWithRefresh que createSession
    const response = await fetchWithRefresh("http://localhost:8080/sessions", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // Important pour l'authentification
    });
    
    // ✅ VÉRIFICATION: Vérifier le content-type de la réponse
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error("Réponse non-JSON reçue:", contentType);
      throw new Error(`Réponse non-JSON reçue: ${contentType}`);
    }
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erreur API:", response.status, errorText);
      throw new Error(`Erreur ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    console.log("Sessions récupérées:", data);
    return data;
    
  } catch (error) {
    console.error("Erreur lors de la récupération des séances:", error);
    
    // ✅ GESTION D'ERREUR AMÉLIORÉE
    if (error.name === 'SyntaxError' && error.message.includes('Unexpected token')) {
      throw new Error("Le serveur a retourné du HTML au lieu de JSON. Vérifiez l'URL de l'API et l'authentification.");
    }
    
    throw error;
  }
};

export { createSession };