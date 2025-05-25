const User = require("../models/User");

class UserController {
  static async getProfile(req, res) {
    try {
      const user = await User.findByPk(req.user.id, {
        attributes: { exclude: ["password"] },
      });
      if (!user)
        return res.status(404).json({ error: "Utlisisateur pas trouvé" });
      res.status(201).json(user);
    } catch (err) {
      res
        .status(500)
        .json({ error: "Erreur interne du serveur", message: err.message });
    }
  }
}

module.exports = UserController;
