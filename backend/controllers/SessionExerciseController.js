const SessionExercise = require("../models/SessionExercise");
const TypeExercise = require("../models/TypeExercise");

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
      const exercise = await SessionExercise.create({
        session_id,
        type_exercise_id,
        sets,
        reps,
        weight_used,
        duration,
        calories_burned,
        notes,
        name,
      });
      res.status(201).json(exercise);
    } catch (err) {
      res
        .status(400)
        .json({ error: "Données pas valide", message: err.message });
    }
  }

  static async getExercisesForSession(req, res) {
    try {
      const exercises = await SessionExercise.findAll({
        where: { session_id: req.params.sessionId },
        include: [
          {
            model: TypeExercise,
            include: [ExerciseCategory],
          },
        ],
      });
      res.json(exercises);
    } catch (err) {
      res
        .status(500)
        .json({ error: "Erreur interne du serveur", message: err.message });
    }
  }
}

module.exports = SessionExerciseController;
