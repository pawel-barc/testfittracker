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
    },
    reps: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    weight_used: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    duration: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    calories_burned: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    name: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    session_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "sessions",
        key: "id",
      },
    },

    type_exercise_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "type_exercises",
        key: "id",
      },
    },
  },
  {
    tableName: "session_exercises",
    timestamps: false,
  }
);
module.exports = SessionExercise;
