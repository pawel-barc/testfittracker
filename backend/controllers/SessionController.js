const Session = require("../models/Session");
const SessionExercise = require("../models/SessionExercise");

class SessionController {
  static async getUserSession(req, res) {
    try {
      const sessions = await Session.findAll({
        where: { user_id: req.user.id },
        order: [['date', 'DESC']] // ✅ Utilise 'date' au lieu de 'created_at'
      });
      res.json(sessions);
    } catch (err) {
      console.error("Erreur lors de la récupération des sessions:", err);
      res.status(500).json({ 
        error: "Erreur interne du serveur", 
        message: err.message 
      });
    }
  }

  static async createSession(req, res) {
    try {
      const sessionData = {
        ...req.body,
        user_id: req.user.id
      };
      
      const session = await Session.create(sessionData);
      res.status(201).json(session);
    } catch (err) {
      console.error("Erreur lors de la création de session:", err);
      res.status(400).json({ 
        error: "Données invalides", 
        message: err.message 
      });
    }
  }

  static async deleteSession(req, res) {
    try {
      const sessionId = req.params.id;
      const userId = req.user.id;

      console.log(`🗑️ Tentative de suppression de la session ${sessionId} par l'utilisateur ${userId}`);

      // Vérifier que la session existe et appartient à l'utilisateur
      const session = await Session.findOne({
        where: { 
          id: sessionId, 
          user_id: userId 
        }
      });

      if (!session) {
        console.log(`❌ Session ${sessionId} introuvable ou non autorisée`);
        return res.status(404).json({ 
          error: "Session introuvable ou non autorisée" 
        });
      }

      // Supprimer d'abord tous les exercices de la session
      const deletedExercises = await SessionExercise.destroy({
        where: { session_id: sessionId }
      });

      console.log(`🗑️ ${deletedExercises} exercices supprimés de la session ${sessionId}`);

      // Supprimer la session
      await session.destroy();

      console.log(`✅ Session ${sessionId} supprimée avec succès`);

      res.json({ 
        message: "Session supprimée avec succès",
        deletedExercises: deletedExercises,
        sessionId: sessionId
      });

    } catch (err) {
      console.error("💥 Erreur lors de la suppression:", err);
      res.status(500).json({ 
        error: "Erreur interne du serveur", 
        message: err.message,
        details: err.stack
      });
    }
  }

  static async getSessionById(req, res) {
    try {
      const sessionId = req.params.id;
      const userId = req.user.id;

      const session = await Session.findOne({
        where: { 
          id: sessionId, 
          user_id: userId 
        }
      });

      if (!session) {
        return res.status(404).json({ 
          error: "Session introuvable" 
        });
      }

      res.json(session);
    } catch (err) {
      console.error("Erreur lors de la récupération de session:", err);
      res.status(500).json({ 
        error: "Erreur interne du serveur", 
        message: err.message 
      });
    }
  }
}

module.exports = SessionController;