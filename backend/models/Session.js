const { DataTypes } = require("sequelize");
const db = require("../db/db");

const Session = db.define(
  "Session",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    duration: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    // 🆕 AJOUT DE LA COLONNE CATEGORY
    category: {
      type: DataTypes.STRING(255), // ou DataTypes.TEXT selon vos besoins
      allowNull: true, // true si la catégorie peut être optionnelle
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
  },
  {
    tableName: "sessions",
    timestamps: false,
  }
);

module.exports = Session;