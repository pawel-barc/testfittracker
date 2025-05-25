const { DataTypes } = require("sequelize");
const db = require("../db/db");

const TypeExercise = db.define(
  "TypeExercise",
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
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    calories_burned_per_min: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    exercise_category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "exercise_categories",
        key: "id",
      },
    },
  },
  {
    tableName: "type_exercises",
    timestamps: false,
  }
);
module.exports = TypeExercise;
