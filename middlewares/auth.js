const jwt = require("jsonwebtoken");
const { User } = require("../models/model");

const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Accès refusé. Token manquant ou invalide." });
    }

    const token = authHeader.split(" ")[1]; // Récupérer uniquement le token

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({ message: "Utilisateur introuvable." });
        }

        // ✅ Vérifier si le token est toujours valide
        if (user.tokenVersion !== decoded.tokenVersion) {
            return res.status(401).json({ message: "Session expirée. Veuillez vous reconnecter." });
        }

        req.user = user;
        next();
    } catch (err) {
        console.error("❌ Erreur de vérification du token :", err);
        res.status(401).json({ message: "Token invalide." });
    }
};

module.exports = authenticate;
