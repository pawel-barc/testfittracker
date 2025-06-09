const SessionExercise = require("../models/SessionExercise");
const TypeExercise = require("../models/TypeExercise");

class SessionExerciseController {
  static async addExerciseToSession(req, res) {
    console.log("=== DÉBUT addExerciseToSession ===");
    
    try {
      const {
        session_id,
        type_exercise_id,
        sets,
        reps,
        weight_used,
        duration,
        calories_burned,
        notes,
        name,
      } = req.body;

      console.log("1. Données brutes reçues:", {
        session_id,
        type_exercise_id,
        name,
        sets,
        reps,
        weight_used,
        duration,
        calories_burned,
        notes
      });

      // Validation de base
      if (!session_id) {
        console.log("❌ Erreur: session_id manquant");
        return res.status(400).json({ error: "session_id est obligatoire" });
      }

      if (!name) {
        console.log("❌ Erreur: name manquant");
        return res.status(400).json({ error: "name est obligatoire" });
      }

      // Préparation des données avec valeurs par défaut
      const exerciseData = {
        session_id: parseInt(session_id),
        name: String(name).trim(),
        sets: parseInt(sets) || 0,
        reps: parseInt(reps) || 0,
        weight_used: parseInt(weight_used) || 0,
        duration: parseFloat(duration) || 0.0,
        calories_burned: parseInt(calories_burned) || 0,
        notes: String(notes || "").trim(),
        type_exercise_id: null // Par défaut null pour les exercices custom
      };

      // Gestion du type_exercise_id
      if (type_exercise_id && !String(type_exercise_id).startsWith('custom-')) {
        exerciseData.type_exercise_id = parseInt(type_exercise_id);
      }

      console.log("2. Données préparées pour insertion:", exerciseData);

      // Vérification finale des types
      console.log("3. Types des données:", {
        session_id: typeof exerciseData.session_id,
        name: typeof exerciseData.name,
        sets: typeof exerciseData.sets,
        reps: typeof exerciseData.reps,
        weight_used: typeof exerciseData.weight_used,
        duration: typeof exerciseData.duration,
        calories_burned: typeof exerciseData.calories_burned,
        notes: typeof exerciseData.notes,
        type_exercise_id: typeof exerciseData.type_exercise_id
      });

      console.log("4. Tentative de création en base...");
      const exercise = await SessionExercise.create(exerciseData);
      
      console.log("✅ Exercice créé avec succès:", {
        id: exercise.id,
        name: exercise.name,
        session_id: exercise.session_id
      });
      
      res.status(201).json({
        success: true,
        data: exercise,
        message: "Exercice ajouté avec succès"
      });
      
    } catch (err) {
      console.error("❌ ERREUR COMPLÈTE:", {
        name: err.name,
        message: err.message,
        stack: err.stack,
        sql: err.sql,
        errors: err.errors
      });
      
      // Analyse spécifique du type d'erreur
      if (err.name === 'SequelizeValidationError') {
        console.error("🔍 Erreurs de validation:", err.errors);
        const validationErrors = err.errors.map(e => ({
          field: e.path,
          message: e.message,
          value: e.value
        }));
        return res.status(400).json({ 
          error: "Erreur de validation",
          details: validationErrors
        });
      }
      
      if (err.name === 'SequelizeForeignKeyConstraintError') {
        console.error("🔍 Erreur de clé étrangère:", err.fields);
        return res.status(400).json({ 
          error: "Référence invalide",
          message: "La session spécifiée n'existe pas",
          field: err.fields
        });
      }
      
      if (err.name === 'SequelizeDatabaseError') {
        console.error("🔍 Erreur SQL:", err.sql);
        return res.status(500).json({ 
          error: "Erreur de base de données",
          message: err.message
        });
      }
      
      // Erreur générique
      res.status(500).json({ 
        error: "Erreur interne du serveur",
        message: err.message,
        type: err.name
      });
    }
    
    console.log("=== FIN addExerciseToSession ===");
  }

  static async getExercisesForSession(req, res) {
    try {
      const exercises = await SessionExercise.findAll({
        where: { session_id: req.params.sessionId },
        include: [
          {
            model: TypeExercise,
            // include: [ExerciseCategory], // Commenté temporairement
          },
        ],
      });
      res.json(exercises);
    } catch (err) {
      console.error("Erreur getExercisesForSession:", err);
      res.status(500).json({ 
        error: "Erreur interne du serveur", 
        message: err.message 
      });
    }
  }
}

module.exports = SessionExerciseController;