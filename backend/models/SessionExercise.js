const { DataTypes } = require("sequelize");
const db = require("../db/db");

const SessionExercise = db.define(
  "SessionExercise",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    sets: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0, // ✅ AMÉLIORATION : Valeur par défaut
    },
    reps: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0, // ✅ AMÉLIORATION : Valeur par défaut
    },
    weight_used: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0, // ✅ AMÉLIORATION : Valeur par défaut
    },
    duration: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0.0, // ✅ AMÉLIORATION : Valeur par défaut
    },
    calories_burned: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0, // ✅ AMÉLIORATION : Valeur par défaut au lieu de NOT NULL strict
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: "", // ✅ AMÉLIORATION : Valeur par défaut
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false, // ✅ Le nom reste obligatoire
      validate: {
        notEmpty: true, // ✅ AMÉLIORATION : Validation pour éviter les chaînes vides
      }
    },
    session_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "sessions",
        key: "id",
      },
      validate: {
        // ✅ SIMPLIFICATION : Validation plus simple
        min: 1,
      }
    },
    // ⚠️ MODIFICATION : Permettre NULL pour les exercices personnalisés
    type_exercise_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // ← Changé de false à true
      references: {
        model: "type_exercises",
        key: "id",
      },
      validate: {
        // ✅ SIMPLIFICATION : Validation plus simple
        isPositiveIfNotNull(value) {
          if (value !== null && value < 1) {
            throw new Error('type_exercise_id doit être positif');
          }
        }
      }
    },
  },
  {
    tableName: "session_exercises",
    timestamps: false,
    // ✅ AMÉLIORATION : Options de validation
    // ✅ SUPPRESSION : Validation trop stricte qui cause des erreurs
  }
);

module.exports = SessionExercise;