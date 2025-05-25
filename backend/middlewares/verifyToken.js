const jwt = require("jsonwebtoken");

// Fonction utilisée pour protéger les ressources. Verifie si la requête possède un token d'accès.
// Si oui, elle permet l'accès aux ressources; sinon elle envoie une réponse spécifique qui sera gérer par la méthode fetchWithRefresh
const verifyToken = async (req, res, next) => {
  const token = await req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ error: "TOKEN_EXPIRED" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "TOKEN_INVALID" });
  }
};

module.exports = verifyToken;
