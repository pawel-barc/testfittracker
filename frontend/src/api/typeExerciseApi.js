import fetchWithRefresh from "./fetchWithRefresh";
import { getExerciseCategories } from "./exerciseCategoriesApi";

export const getTypeExercises = async () => {
  try {
    console.log("🔍 Appel API getTypeExercises");

    // ✅ CORRECTION: Utiliser l'URL complète comme les autres APIs
    const apiUrl = 'http://localhost:8080/type-exercises';
    console.log("🛰️ Tentative de requête vers:", apiUrl);
    
    // ✅ CORRECTION: Utiliser fetchWithRefresh comme sessionExerciseApi.js
    const response = await fetchWithRefresh(apiUrl, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });
    
    console.log("📡 Réponse getTypeExercises - Status:", response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log("📦 Données getTypeExercises reçues:", data);
    console.log("📊 Nombre d'exercices:", data?.length || 0);
    
    // Vérifier la structure des données
    if (data && data.length > 0) {
      const firstExercise = data[0];
      console.log("📊 Structure du premier exercice:", firstExercise);
      console.log("🏷️ Clés disponibles:", Object.keys(firstExercise));
      console.log("🆔 exercise_category_id présent?", 'exercise_category_id' in firstExercise);
      console.log("🔢 Type de exercise_category_id:", typeof firstExercise.exercise_category_id);
    }
    
    return data || [];
    
  } catch (error) {
    console.error("💥 Erreur dans getTypeExercises:", error.message);
    console.error("💥 Stack:", error.stack);
    throw error;
  }
};

// ✅ NOUVELLE FONCTION: Debug complet
export const debugTypeExercises = async () => {
  try {
    console.log("🔍 === DEBUG TYPE EXERCISES COMPLET ===");
    
    // Test 1: Récupérer les exercices
    const exercises = await getTypeExercises();
    console.log("🏋️ Exercices récupérés:", exercises.length);
    
    // Test 2: Récupérer les catégories
    const categories = await getExerciseCategories();
    console.log("🏷️ Catégories récupérées:", categories.length);
    
    // Test 3: Analyser la correspondance
    console.log("🔍 === ANALYSE DES CORRESPONDANCES ===");
    categories.forEach(cat => {
      const matchingExercises = exercises.filter(ex => {
        const match = String(ex.exercise_category_id) === String(cat.id);
        if (match) {
          console.log(`✅ Match: ${ex.name} -> Cat ${cat.name}`);
        }
        return match;
      });
      console.log(`📊 Catégorie "${cat.name}" (ID: ${cat.id}) -> ${matchingExercises.length} exercices`);
      
      if (matchingExercises.length > 0) {
        matchingExercises.forEach(ex => {
          console.log(`  - ${ex.name} (ID: ${ex.id})`);
        });
      }
    });
    
    // Test 4: Vérifier spécifiquement la catégorie ID 2 (Swimming)
    const swimmingExercises = exercises.filter(ex => 
      String(ex.exercise_category_id) === "2"
    );
    console.log("🏊 Exercices Swimming (ID=2):", swimmingExercises);
    
    return { exercises, categories };
    
  } catch (error) {
    console.error("💥 Erreur debug:", error);
    return null;
  }
};

// Test rapide des catégories (fonction existante améliorée)
export const debugCategories = async () => {
  try {
    const result = await debugTypeExercises();
    return result;
  } catch (error) {
    console.error("Erreur debug:", error);
    return null;
  }
};