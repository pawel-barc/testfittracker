const { DataTypes } = require("sequelize");
const db = require("../db/db");

const UserStat = db.define(
  "UserStat",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    height: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    weight: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    bmi: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    body_fat_percentage: {
      type: DataTypes.FLOAT,
      allowNull: true,
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
  { tableName: "user_stats", timestamps: false }
);
module.exports = UserStat;
