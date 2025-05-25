const TypeExercise = require("../models/TypeExercise");

class TypeExerciseController {
  static async getAllTypesExercises(req, res) {
    try {
      const exercises = await TypeExercise.findAll();
      res.json(exercises);
    } catch (err) {
      res
        .status(500)
        .json({ error: "Erreur interne du serveur", message: err.message });
    }
  }
  static async addExerciseType(req, res) {
    try {
      const {
        name,
        description,
        calories_burned_per_min,
        exercise_category_id,
      } = req.body;
      if (!name || !calories_burned_per_min || !exercise_category_id) {
        return res.status(400).json({
          error: "Le nom et les calories brûlées par minute sont requis ",
        });
      }
      const type = await TypeExercise.create({
        name,
        description,
        calories_burned_per_min,
        exercise_category_id,
      });
      res.status(201).json(type);
    } catch (err) {
      res
        .status(500)
        .json({ error: "Erreur interne du serveur", message: err.message });
    }
  }
}
module.exports = TypeExerciseController;
