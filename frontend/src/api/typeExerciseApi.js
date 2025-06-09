export const getTypeExercises = async () => {
  try {
    console.log("🔍 Appel API getTypeExercises");
    
    const response = await fetch('/api/type-exercises', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log("📡 Réponse getTypeExercises - Status:", response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log("📦 Données getTypeExercises reçues:", data);
    console.log("📊 Structure du premier exercice:", data[0]);
    
    // Vérifier la structure des données
    if (data && data.length > 0) {
      const firstExercise = data[0];
      console.log("🏷️ Clés disponibles:", Object.keys(firstExercise));
      console.log("🆔 exercise_category_id présent?", 'exercise_category_id' in firstExercise);
    }
    
    return data;
    
  } catch (error) {
    console.error("💥 Erreur dans getTypeExercises:", error);
    throw error;
  }
};

// Test rapide des catégories
export const debugCategories = async () => {
  try {
    const categories = await getExerciseCategories();
    const exercises = await getTypeExercises();
    
    console.log("🏷️ CATEGORIES:", categories);
    console.log("🏋️ EXERCISES:", exercises);
    
    // Vérifier la correspondance
    categories.forEach(cat => {
      const matchingExercises = exercises.filter(ex => 
        String(ex.exercise_category_id) === String(cat.id)
      );
      console.log(`Category "${cat.name}" (ID: ${cat.id}) -> ${matchingExercises.length} exercices`);
    });
    
  } catch (error) {
    console.error("Erreur debug:", error);
  }
};