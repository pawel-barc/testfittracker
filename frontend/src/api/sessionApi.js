// src/api/session.js
import fetchWithRefresh from "./fetchWithRefresh";

// 🆕 AJOUT DE CATEGORY DANS LES PARAMÈTRES
const createSession = async ({ title, notes, duration, date, category }) => {
  const request = await fetchWithRefresh("http://localhost:8080/sessions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ 
      title, 
      notes, 
      duration, 
      date, 
      category // 🆕 Ajout de la catégorie
    }),
  });
  return await request.json();
};

export const getSessions = async () => {
  try {
    const response = await fetchWithRefresh("http://localhost:8080/sessions", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    
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
    
    // 🔍 DEBUG: Vérifiez que category est bien présent
    console.log("Sessions récupérées avec catégories:", data.map(s => ({
      id: s.id,
      title: s.title,
      category: s.category
    })));
    
    return data;
    
  } catch (error) {
    console.error("Erreur lors de la récupération des séances:", error);
    
    if (error.name === 'SyntaxError' && error.message.includes('Unexpected token')) {
      throw new Error("Le serveur a retourné du HTML au lieu de JSON. Vérifiez l'URL de l'API et l'authentification.");
    }
    
    throw error;
  }
};

// 🆕 AJOUT DE LA FONCTION DELETE SESSION
export const deleteSession = async (sessionId) => {
  try {
    const response = await fetchWithRefresh(`http://localhost:8080/sessions/${sessionId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erreur lors de la suppression:", response.status, errorText);
      throw new Error(`Erreur ${response.status}: ${errorText}`);
    }
    
    // Pour les requêtes DELETE, la réponse peut être vide
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    }
    
    return { success: true };
    
  } catch (error) {
    console.error("Erreur lors de la suppression de la séance:", error);
    throw error;
  }
};

export { createSession };