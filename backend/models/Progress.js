const { DataTypes } = require("sequelize");
const db = require("../db/db");

const Progress = db.define(
  "Progress",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    current_value: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    goal_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "goals",
        key: "id",
      },
    },
  },
  {
    tableName: "progress",
    timestamps: false,
  }
);
module.exports = Progress;
