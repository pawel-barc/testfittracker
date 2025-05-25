const Session = require("../models/Session");
const SessionExercise = require("../models/SessionExercise");
class SessionController {
  static async getUserSession(req, res) {
    try {
      const session = await Session.findAll({
        where: { user_id: req.user.id },
        include: [SessionExercise],
      });
      res.json(session);
    } catch (err) {
      res
        .status(500)
        .json({ error: "Erreur interne du serveur", message: err.message });
    }
  }
  static async createSession(req, res) {
    try {
      const { notes, duration, title, exercises = [] } = req.body;
      const date = new Date();
      const session = await Session.create({
        user_id: req.user.id,
        date,
        notes,
        duration,
        title,
      });

      for (const ex of exercises) {
        await SessionExercise.create({
          session_id: session.id,
          type_exercise_id: ex.typeExerciseId || null,
          name: ex.name || null,
          notes: ex.notes || null,
        });
      }
      res.status(201).json({session});
    } catch (err) {
      res
        .status(400)
        .json({ error: "Donnes pas valide", message: err.message });
    }
  }
}

module.exports = SessionController;
