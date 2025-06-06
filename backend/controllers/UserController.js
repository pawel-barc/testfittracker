const fs = require('fs');
const path = require('path');
const User = require("../models/User");

class UserController {
  static async getProfile(req, res) {
    try {
      const user = await User.findByPk(req.user.id, {
        attributes: { exclude: ["password"] },
      });
      if (!user)
        return res.status(404).json({ error: "Utilisateur pas trouvé" });
      res.status(200).json(user);
    } catch (err) {
      res
        .status(500)
        .json({ error: "Erreur interne du serveur", message: err.message });
    }
  }

  static async updateProfile(req, res) {
    try {
      const user = await User.findByPk(req.user.id);
      if (!user) {
        return res.status(404).json({ error: "Utilisateur pas trouvé" });
      }

      const { firstName, lastName, email, gender, birthDate } = req.body;
      
      // Gestion de l'avatar
      let avatarPath = user.avatar;
      if (req.file) {
        // Supprimer l'ancien avatar s'il existe
        if (avatarPath) {
          const oldAvatarPath = path.join(__dirname, '../img', avatarPath);
          if (fs.existsSync(oldAvatarPath)) {
            fs.unlinkSync(oldAvatarPath);
          }
        }
        
        // Stocker le nouveau chemin
        avatarPath = req.file.filename;
      }

      // Mise à jour des données
      await user.update({
        first_name: firstName,
        last_name: lastName,
        email,
        gender,
        birth_date: birthDate,
        avatar: avatarPath,
      });

      // Exclure le mot de passe de la réponse
      const updatedUser = await User.findByPk(req.user.id, {
        attributes: { exclude: ["password"] },
      });

      res.status(200).json(updatedUser);
    } catch (err) {
      res
        .status(500)
        .json({ error: "Erreur interne du serveur", message: err.message });
    }
  }

  static async updatePassword(req, res) {
    try {
      const user = await User.findByPk(req.user.id);
      if (!user) {
        return res.status(404).json({ error: "Utilisateur pas trouvé" });
      }

      const { currentPassword, newPassword } = req.body;

      // Vérifier le mot de passe actuel
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Mot de passe actuel incorrect" });
      }

      // Mettre à jour le mot de passe
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await user.update({ password: hashedPassword });

      res.status(200).json({ message: "Mot de passe mis à jour avec succès" });
    } catch (err) {
      res
        .status(500)
        .json({ error: "Erreur interne du serveur", message: err.message });
    }
  }
}

module.exports = UserController;