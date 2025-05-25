const Notification = require("../models/Notification");

class NotificationController {
  static async getUserNotification(req, res) {
    try {
      const notification = await Notification.findAll({
        where: { user_id: req.user.id },
      });
      res.json(notification);
    } catch (err) {
      res
        .status(500)
        .json({ error: "Erreur interne du serveur", message: err.message });
    }
  }
  static async markAsRead(req, res) {
    try {
      const { id } = req.params;

      const notification = await Notification.findOne({
        where: { id, user_id: req.user.id },
      });

      if (!notification) {
        return res.status(404).json({
          error: "Notification introuvable.",
        });
      }

      notification.status = "read";
      await notification.save();

      res.json({ message: "Notification marquée comme lue." });
    } catch (err) {
      res.status(500).json({
        error: "Erreur interne du serveur",
        message: err.message,
      });
    }
  }
}

module.exports = NotificationController;
