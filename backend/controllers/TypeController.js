const Type = require("../models/Type");

class TypeController {
  static async createType(req, res) {
    try {
      const { title } = req.body;
      if (!title) {
        res.status(404).json({ error: "Verifiez les données" });
      }

      const newType = await Type.create({ title });
      res.status(201).json(newType);
    } catch (err) {
      res
        .status(500)
        .json({ error: "Erreur interne du serveur", message: err.message });
    }
  }

  static async getAllTypes(req, res) {
    try {
      const types = await Type.findAll({ attributes: ["id", "title"] });
      res.status(200).json(types);
    } catch (err) {
      res
        .status(500)
        .json({ error: "Erreur interne du serveur", message: err.message });
    }
  }
}
module.exports = TypeController;
