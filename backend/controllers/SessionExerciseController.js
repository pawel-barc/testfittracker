const SessionExercise = require("../models/SessionExercise");
const TypeExercise = require("../models/TypeExercise");
const ExerciseCategory = require("../models/ExerciseCategory"); // ✅ AJOUT : Import manquant

class SessionExerciseController {
  static async addExerciseToSession(req, res) {
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

      // ⚠️ DEBUGGING : Afficher les données reçues
      console.log("Données reçues:", {
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

      // ⚠️ VALIDATION : Vérifier que les données obligatoires sont présentes
      if (!session_id) {
        return res.status(400).json({ error: "session_id est obligatoire" });
      }

      if (!name) {
        return res.status(400).json({ error: "name est obligatoire" });
      }

      // ✅ AMÉLIORATION : Validation plus stricte des types
      const sessionIdNum = Number(session_id);
      if (isNaN(sessionIdNum)) {
        return res.status(400).json({ error: "session_id doit être un nombre valide" });
      }

      // ✅ AMÉLIORATION : Gestion plus robuste des valeurs nulles/undefined
      const exerciseData = {
        session_id: sessionIdNum,
        type_exercise_id: type_exercise_id && !String(type_exercise_id).startsWith('custom-') 
          ? Number(type_exercise_id) 
          : null,
        sets: sets ? Number(sets) : 0,
        reps: reps ? Number(reps) : 0,
        weight_used: weight_used ? Number(weight_used) : 0,
        duration: duration ? Number(duration) : 0,
        calories_burned: calories_burned ? Number(calories_burned) : 0,
        notes: notes || "",
        name: name || "",
      };

      console.log("Données à insérer:", exerciseData);

      const exercise = await SessionExercise.create(exerciseData);
      
      console.log("✅ Exercice créé avec succès:", exercise.id);
      res.status(201).json(exercise);
    } catch (err) {
      // ⚠️ DEBUGGING : Afficher l'erreur complète
      console.error("Erreur complète:", err);
      
      // ✅ AMÉLIORATION : Meilleure gestion des erreurs Sequelize
      let errorMessage = "Données pas valide";
      let statusCode = 400;
      
      if (err.name === 'SequelizeValidationError') {
        errorMessage = "Erreur de validation: " + err.errors.map(e => e.message).join(', ');
      } else if (err.name === 'SequelizeForeignKeyConstraintError') {
        errorMessage = "Erreur de clé étrangère: vérifiez que la session existe";
        statusCode = 404;
      } else if (err.name === 'SequelizeDatabaseError') {
        errorMessage = "Erreur de base de données: " + err.message;
        statusCode = 500;
      }
      
      res.status(statusCode).json({ 
        error: errorMessage,
        message: err.message,
        details: err.errors || null,
        name: err.name || 'Unknown'
      });
    }
  }

  static async getExercisesForSession(req, res) {
    try {
      console.log("🔍 Récupération des exercices pour session:", req.params.sessionId);
      
      const exercises = await SessionExercise.findAll({
        where: { session_id: req.params.sessionId },
        include: [
          {
            model: TypeExercise,
            required: false, // ✅ AJOUT : LEFT JOIN au lieu de INNER JOIN
            include: [
              {
                model: ExerciseCategory,
                required: false // ✅ AJOUT : LEFT JOIN au lieu de INNER JOIN
              }
            ],
          },
        ],
        order: [['id', 'ASC']] // ✅ AJOUT : Tri par ordre de création
      });
      
      console.log("✅ Exercices trouvés:", exercises.length);
      res.json(exercises);
    } catch (err) {
      console.error("💥 Erreur getExercisesForSession:", err);
      res.status(500).json({ 
        error: "Erreur interne du serveur", 
        message: err.message,
        details: err.stack
      });
    }
  }
}

module.exports = SessionExerciseController;