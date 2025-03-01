const jwt = require("jsonwebtoken");
const { User } = require("../models/model");
const rateLimit = require("express-rate-limit");

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
        res.status(401).json({ message: "Token invalide. Vous allez être déconnecté" });
    }
};

// ✅ Middleware d'autorisation (gestion des rôles)
const authorize = (roles = []) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "⛔ Accès refusé. Vous n'avez pas les permissions nécessaires." });
        }
        next();
    };
};

// 🔥 Limiteur de requêtes pour éviter les attaques de brute-force sur la réinitialisation de mot de passe
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3, // 3 tentatives
    handler: (req, res) => { // ⚠️ Utilisez "handler" pour formater la réponse
        res.status(429).json({
            success: false,
            message: "Trop de tentatives. Réessayez dans 15 minutes."
        });
    }
});


// Exporter les deux middlewares
module.exports = { authenticate, authorize, loginLimiter };

