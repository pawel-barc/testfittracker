const { Sequelize } = require("sequelize");

const db = new Sequelize("fittracker", "postgres", "root", {
  host: "localhost",
  dialect: "postgres",
});

module.exports = db;
