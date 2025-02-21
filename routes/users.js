const express = require("express");
const routes = express.Router();
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const { setPosts, editpost, getposts, get_with_Id_dossier, deletepost, newuser, login,refreshtoken, recupass, last_id_dossier, search_rs,
    records_de_jours, recherche_multiple } = require("../controller/datacontroller");

//authentification -----------------------
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Accès refusé. Token manquant ou invalide." });
    }

    const token = authHeader.split(" ")[1]; // Récupérer uniquement le token

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.error("❌ Erreur de vérification du token :", err);
        res.status(401).json({ message: "Token invalide." });
    }
};


// Définir les routes spécifiques AVANT les routes dynamiques
routes.post("/reset-password", recupass);
routes.post("/posts", setPosts);
routes.post(
    "/newuser",
    [
        body("nomComplet").notEmpty().withMessage("Le nom complet est obligatoire."),
        body("nomUtilisateur").notEmpty().withMessage("Le nom d'utilisateur est obligatoire."),
        body("email").isEmail().withMessage("L'email est invalide."),
        body("motDePasse").isLength({ min: 6 }).withMessage("Le mot de passe doit contenir au moins 6 caractères."),
    ],
    newuser
);

routes.get("/records_de_jours", records_de_jours); // Correction de la route pour récupérer l'ID dossier
routes.get("/last_id_dossier", last_id_dossier); // Correction de la route pour récupérer l'ID dossier
routes.get("/search_rs", search_rs); // Route spécifique pour récupérer tous les utilisateurs
routes.post("/login", login); // Route spécifique pour récupérer tous les utilisateurs
routes.post("/refresh-token", refreshtoken); // Route spécifique pour rafréchir le token
routes.get("/recherche_multiple", authenticate, recherche_multiple);


// Les routes dynamiques doivent venir après
routes.get("/", authenticate, getposts);
routes.get("/:id", authenticate, get_with_Id_dossier);
routes.delete("/:id", authenticate, deletepost);
routes.put("/:p", authenticate, editpost);

module.exports = routes;