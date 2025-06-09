const Session = require("../models/Session");
const SessionExercise = require("../models/SessionExercise");

class SessionController {
  static getUserSession = async (req, res) => {
    try {
      console.log("Requête reçue pour /sessions");
      
      // ✅ CORRECTION : Utiliser le modèle Session au lieu de getSessionsFromDB
      const sessions = await Session.findAll({
        where: { user_id: req.user.id },
        order: [['date', 'DESC']], // Plus récentes en premier
        include: [
          {
            model: SessionExercise,
            required: false
          }
        ]
      });
      
      console.log("Séances récupérées :", sessions);
      res.status(200).json(sessions);
    } catch (err) {
      console.error("Erreur dans getUserSession :", err);
      res.status(500).json({ 
        error: "Erreur interne du serveur", 
        message: err.message 
      });
    }
  };

  static async createSession(req, res) {
    try {
      const { notes, duration, title, exercises = [] } = req.body;
      const date = new Date();
      
      console.log("Création session avec:", { title, duration, notes, user_id: req.user.id });
      
      const session = await Session.create({
        user_id: req.user.id,
        date,
        notes,
        duration,
        title,
      });

      console.log("Session créée:", session.toJSON());

      // Créer les exercices associés
      for (const ex of exercises) {
        await SessionExercise.create({
          session_id: session.id,
          type_exercise_id: ex.typeExerciseId || null,
          name: ex.name || null,
          notes: ex.notes || null,
        });
      }
      
      // ✅ CORRECTION : Retourner la session avec un format cohérent
      res.status(201).json({
        session: session.toJSON() // Utiliser toJSON() pour avoir un objet propre
      });
    } catch (err) {
      console.error("Erreur création session:", err);
      res.status(400).json({ 
        error: "Données pas valides", 
        message: err.message 
      });
    }
  }
}

module.exports = SessionController;