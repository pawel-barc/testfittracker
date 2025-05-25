const UserStat = require("../models/UserStat");

class UserStatController {
  static async getStats(req, res) {
    try {
      const stats = await UserStat.findAll({
        where: { user_id: req.user.id },
        order: [["created_at", "DESC"]],
      });
      res.json(stats);
    } catch (err) {
      res
        .status(500)
        .json({ error: "Erreur interne du serveur", message: err.message });
    }
  }

  static async addStat(req, res) {
    try {
      const { weight, height, body_fat_percentage } = req.body;
      if (!weight || !height) {
        return res.status(400).json({
          error: "La taille et le poids sont requis pour calculer 'l'IMC'.",
        });
      }
      if (weight < 30 || weight > 300) {
        return res
          .status(400)
          .json({ error: "Le poids doit être compris entre 30 et 300 kg." });
      }
      if (height < 100 || height > 250) {
        return res.status(400).json({
          error: "La taille doit être compris entre 100 cm et 250 cm",
        });
      }

      const rowBmi = weight / Math.pow(height / 100, 2);
      const bmi = parseFloat(rowBmi.toFixed(2));
      const statData = {
        user_id: req.user.id,
        weight,
        height,
        bmi,
        created_at: new Date(),
      };

      if (body_fat_percentage !== undefined) {
        if (body_fat_percentage < 3 || body_fat_percentage > 60) {
          return res
            .status(400)
            .json({
              error:
                "Le pourcentage de graisse corporelle doit être compris entre 3 et 60 %",
            });
        }
        statData.body_fat_percentage = body_fat_percentage;
      }
      const stat = await UserStat.create(statData);
      res.status(201).json(stat);
    } catch (err) {
      res
        .status(400)
        .json({ error: "Données pas valide", message: err.message });
    }
  }
}

module.exports = UserStatController;
