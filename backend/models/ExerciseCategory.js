const { DataTypes } = require("sequelize");
const db = require("../db/db");

const ExerciseCategory = db.define(
  "ExerciseCategory",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  { tableName: "exercise_categories", timestamps: false }
);
module.exports = ExerciseCategory;
