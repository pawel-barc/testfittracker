const { Sequelize } = require("sequelize");

const db = new Sequelize("fitrack", "postgres", "root", {
  host: "localhost",
  dialect: "postgres",
  port: 5432,
});

// Fonction pour tester la connexion
const testConnection = async () => {
  try {
    await db.authenticate();
    console.log("✅ Connexion à la base de données établie avec succès.");
  } catch (error) {
    console.error("❌ Impossible de se connecter à la base de données:", error);
  }
};

// Appeler la fonction de test
testConnection();

module.exports = db;
