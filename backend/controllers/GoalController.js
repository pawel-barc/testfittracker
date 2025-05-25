const Goal = require("../models/Goal");
const Type = require("../models/Type");
const Progress = require("../models/Progress");

class GoalController {
  static async getGoals(req, res) {
    try {
      const goals = await Goal.findAll({
        where: { user_id: req.user.id },
        include: [{ model: Progress, as: "progress" }],
      });
      res.json(goals);
    } catch (err) {
      res
        .status(500)
        .json({ error: "Erreur interne du serveur", message: err.message });
    }
  }

  static async createGoal(req, res) {
    try {
      const { title, status, target, start_date, end_date, initial_value } =
        req.body;
      const newGoal = await Goal.create({
        user_id: req.user.id,
        title,
        status,
        target,
        start_date,
        end_date,
      });
      await Progress.create({
        goal_id: newGoal.id,
        current_value: initial_value,
        updated_at: new Date(),
      });
      res.status(201).json(newGoal);
    } catch (err) {
      res
        .status(400)
        .json({ error: "Données pas valide", message: err.message });
    }
  }
}
module.exports = GoalController;
