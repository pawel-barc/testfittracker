const Progress = require("../models/Progress");

class ProgressController {
  static async getProgressForGoal(req, res) {
    try {
      const progress = await Progress.findAll({
        where: { goal_id: req.params.goalId },
      });
      res.json(progress);
    } catch (err) {
      res.status(500).json({
        error: "Erreur interne du serveur",
        message: err.message,
      });
    }
  }

  static async addProgressForGoal(req, res) {
    try {
      const { goal_id, current_value } = req.body;
      const updated_at = new Date();
      const newProgress = await Progress.create({
        goal_id,
        current_value,
        updated_at,
      });
      res.status(201).json(newProgress);
    } catch (err) {
      res.status(400).json({ error: "Les données non valide" });
    }
  }
}

module.exports = ProgressController;
