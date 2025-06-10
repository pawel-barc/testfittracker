//Importation du modèle User et des bibliothèques nécessaires
const User = require("../models/User");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
//Importation des fonctions de validation
const {
  validateEmail,
  validateLength,
  validatePassword,
} = require("../utils/validator");

class AuthController {
  //Méthode pour l'inscription de l'utilisateur
  static register = async (req, res) => {
    const { first_name, email, password, birth_date, gender, last_name } =
      req.body; //Récupération des données envoyées dans le corps de la requête
    const avatar = req.file ? req.file.filename : null;
    //Tableau pour stocker les erreurs de validation
    const errors = [];

    // Validation du nom, de l'email et du mot de passe
    if (!validateLength(first_name, 3)) {
      errors.push('"Le nom est requis et doit contenir au moins 3 caractères"');
    }
    if (!validateLength(last_name, 3)) {
      errors.push('"Le nom est requis et doit contenir au moins 3 caractères"');
    }

    if (!validateEmail(email)) {
      errors.push("Le format de l'email est incorrect");
    }

    if (!validatePassword(password)) {
      errors.push(
        "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial "
      );
    }
    //Si des erreurs sont présentes, renvoyer une réponse avec un code 400
    if (errors.length) {
      return res.status(400).json({
        error: errors,
      });
    }
    //Vérification si l'email est déjà utilisé
    try {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({
          error: "L'email existe déjà dans la base de données",
        });
      }
      //Hachage du mot du passe avant de l'enregistrer
      const hashedPassword = await bcryptjs.hash(password, 12);
      //Création d'un nouvel utilisateur
      const newUser = await User.create({
        first_name,
        last_name,
        email,
        password: hashedPassword,
        birth_date,
        gender,
        avatar,
      });

      //Stockage des tokens dans des variables
      const accessToken = AuthController.generateAccessToken(newUser);
      const refreshToken = AuthController.generateRefreshToken(newUser);

      //Envoi du refreshToken sous forme de cookie sécurisé avec la réponse
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === "production", //Pour la production, activer le cookie sécurisé(HTTPS)
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      //Envoi du accessToken sous forme de cookie sécurisé avec la réponse
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === "production", //Pour la production, activer le cookie sécurisé(HTTPS)
        sameSite: "Strict",
        maxAge: 45 * 60 * 1000,
      });

      //Réponse de succès
      res.status(201).json({
        success: "Utilisateur inscrit!",
        newUser: {
          id: newUser.id,
          first_name: newUser.first_name,
          last_name: newUser.last_name,
          email: newUser.email,
        },
      });
    } catch (err) {
      //Gestion des erreurs internes du serveur et renvoi d'un message approprié
      res.status(500).json({
        error: "Erreur interne du serveur",
        message: err.message, //Détails de l'erreur pour aider au diagnostic dans le développement
      });
    }
  };

  //Méthode pour la connexion de l'utilisateur
  static login = async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ where: { email } });
      if (!user || !(await bcryptjs.compare(password, user.password))) {
        return res.status(400).json({
          error: "Email ou mot de passe incorrect",
        });
      }

      const accessToken = AuthController.generateAccessToken(user);
      const refreshToken = AuthController.generateRefreshToken(user);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "Strict",
        maxAge: 45 * 60 * 1000,
      });

      res.status(200).json({
        success: "Utilisateur connecté",
        user: {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
        },
      });
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({
        error: "Erreur interne du serveur",
        message: err.message,
      });
    }
  };

  //Méthode pour rafraîchir le tokens d'accès
  static refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    //Vérification si refreshToken existe
    if (!refreshToken) {
      return res.status(401).json({
        error: "Aucun refresh token trouvé!!!",
      });
    }
    try {
      //Vérification et décryptage du refreshToken
      const payload = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );

      //Récupération de l'utilisateur correspondant à l'ID stocké dans token
      const user = await User.findByPk(payload.id);
      if (!user) {
        return res.status(401).json({
          error: "L'utilisateur non trouvé",
        });
      }

      //Génération d'un nouveau token d'accès
      const accessToken = AuthController.generateAccessToken(user);
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === "production", //Pour la production, activer le cookie sécurisé(HTTPS)
        sameSite: "Strict",
        maxAge: 45 * 60 * 1000,
      });

      res.status(200).json({
        success: "Token d'accès mis à jour",
      });
      //Suppression des cookies en cas des erreurs
    } catch (error) {
      res.clearCookie("refreshToken");
      res.clearCookie("accessToken");
      res.status(401).json({
        error: "Token invalide ou expiré",
      });
    }
  };

  //Méthode pour générer un nouveau token d'accès
  static generateAccessToken(user) {
    return jwt.sign({ id: user.id, name: user.name }, process.env.JWT_SECRET, {
      expiresIn: "45m",
    });
  }

  //Méthode pour générer un nouveau token de rafraîchement
  static generateRefreshToken(user) {
    return jwt.sign(
      { id: user.id, name: user.name },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "7d",
      }
    );
  }

  //Méthode pour la déconnexion de l'utilisateur
  static logout(req, res) {
    try {
      //La suppression du cookie refreshToken
      res.clearCookie("refreshToken", {
        httpOnly: true,
        sameSite: "Strict",
        // secure: process.env.NODE_ENV === "production"  prevu pour la production
        expires: new Date(0),
      });

      //La suppression du cookie accessToken
      res.clearCookie("accessToken", {
        httpOnly: true,
        sameSite: "Strict",
        // secure: process.env.NODE_ENV === "production"  prevu pour la production
        expires: new Date(0),
      });
      //Réponse de succès après la déconnexion
      res.status(200).json({
        success: "Utilisateur déconnecté avec succès",
      });
    } catch (err) {
      res.status(500).json({
        error: "Erreur interne du serveur",
        message: err.message,
      });
    }
  }
}

module.exports = AuthController;
