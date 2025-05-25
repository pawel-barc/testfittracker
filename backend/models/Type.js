const { DataTypes } = require("sequelize");
const db = require("../db/db");

const Type = db.define(
  "Type",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  { tableName: "types", timestamps: false }
);
module.exports = Type;
