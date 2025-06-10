import fetchWithRefresh from "./fetchWithRefresh";

const addSessionExercise = async (values) => {
  console.log("🚀 === addSessionExercise DEBUG ===");
  console.log("📤 Données envoyées:", values);
  console.log("🔍 Types des données:", {
    session_id: typeof values.session_id,
    type_exercise_id: typeof values.type_exercise_id,
    name: typeof values.name,
    sets: typeof values.sets,
    reps: typeof values.reps,
    weight_used: typeof values.weight_used,
    duration: typeof values.duration,
    calories_burned: typeof values.calories_burned,
    notes: typeof values.notes
  });
  
  // ✅ VALIDATION DES DONNÉES
  const validationErrors = [];
  
  if (!values.session_id || isNaN(Number(values.session_id))) {
    validationErrors.push("session_id manquant ou invalide");
  }
  
  if (!values.name || values.name.trim() === '') {
    validationErrors.push("name manquant");
  }
  
  if (validationErrors.length > 0) {
    console.error("❌ Erreurs de validation:", validationErrors);
    throw new Error("Validation échouée: " + validationErrors.join(", "));
  }
  
  try {
    console.log("🌐 Envoi vers:", "http://localhost:8080/session-exercises");
    
    const response = await fetchWithRefresh(
      "http://localhost:8080/session-exercises",
      {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify(values),
        credentials: "include",
      }
    );
    
    console.log("📡 Status de la réponse:", response.status);
    console.log("📡 Headers de la réponse:", [...response.headers.entries()]);
    
    if (!response.ok) {
      console.error("❌ Réponse HTTP not OK:", response.status, response.statusText);
      
      // Essayer de lire le corps de l'erreur
      let errorBody;
      const contentType = response.headers.get('content-type');
      
      try {
        if (contentType && contentType.includes('application/json')) {
          errorBody = await response.json();
          console.error("📋 Corps d'erreur JSON:", errorBody);
        } else {
          errorBody = await response.text();
          console.error("📄 Corps d'erreur texte:", errorBody);
        }
      } catch (readError) {
        console.error("💥 Impossible de lire le corps d'erreur:", readError);
        errorBody = "Impossible de lire l'erreur";
      }
      
      const error = new Error(`HTTP ${response.status}: ${JSON.stringify(errorBody)}`);
      error.status = response.status;
      error.response = response;
      error.data = errorBody;
      throw error;
    }
    
    const result = await response.json();
    console.log("✅ Succès addSessionExercise:", result);
    return result;
    
  } catch (error) {
    console.error("💥 Erreur complète dans addSessionExercise:", error);
    
    // Ajouter plus d'informations à l'erreur
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      console.error("🌐 Problème de réseau ou serveur non accessible");
    }
    
    throw error;
  }
};

const getSessionExercises = async (sessionId) => {
  console.log("🔍 getSessionExercises pour session:", sessionId);
  
  try {
    const response = await fetchWithRefresh(
      `http://localhost:8080/session-exercise/${sessionId}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }
    );
    
    console.log("📡 Status getSessionExercises:", response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const result = await response.json();
    console.log("✅ Exercices récupérés:", result);
    return result;
    
  } catch (error) {
    console.error("💥 Erreur getSessionExercises:", error);
    throw error;
  }
};

// ✅ NOUVELLE FONCTION: Test direct de l'API
export const testSessionExerciseAPI = async (testData) => {
  console.log("🧪 === TEST SESSION EXERCISE API ===");
  
  const sampleData = testData || {
    session_id: 1,
    type_exercise_id: 1,
    name: "Test Exercise",
    sets: 3,
    reps: 10,
    weight_used: 50,
    duration: 60,
    calories_burned: 100,
    notes: "Test notes"
  };
  
  try {
    console.log("🧪 Test avec données:", sampleData);
    const result = await addSessionExercise(sampleData);
    console.log("✅ Test réussi:", result);
    return result;
  } catch (error) {
    console.error("❌ Test échoué:", error);
    return null;
  }
};



export { addSessionExercise, getSessionExercises };