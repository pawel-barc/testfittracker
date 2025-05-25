const ExerciseCategory = require("../models/ExerciseCategory");

class ExerciseCategoryController {
  static async getAllCategories(req, res) {
    try {
      const categories = await ExerciseCategory.findAll();
      res.json(categories);
    } catch (err) {
      res
        .status(500)
        .json({ error: "Erreur interne du serveur", message: err.message });
    }
  }
  static async addCategory(req, res) {
    try {
      const { name } = req.body;
      const category = await ExerciseCategory.create({
        name,
      });
      res.status(201).json(category);
    } catch (err) {
      res
        .status(400)
        .json({ error: "Données pas valide", message: err.message });
    }
  }
}
module.exports = ExerciseCategoryController;
