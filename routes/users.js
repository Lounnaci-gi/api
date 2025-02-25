const express = require("express");
const routes = express.Router();
const { authenticate, authorize } = require("../middlewares/auth");
const rateLimit = require("express-rate-limit"); // Ajout du limiteur

const { body, validationResult } = require("express-validator");
const { new_dossier, editpost, getposts, get_with_Id_dossier, deletepost, newuser, login,
        recupass, resetPassword, last_id_dossier, search_rs,
        records_de_jours, recherche_multiple, ajout_article } = require("../controller/datacontroller");

// 🔥 Limiteur de requêtes pour éviter les attaques de brute-force sur la réinitialisation de mot de passe
const resetPasswordLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3, // Limite à 3 tentatives par IP
    message: "Trop de tentatives de réinitialisation. Réessayez plus tard.",
});

// 🔹 Routes spécifiques
routes.post("/reset-password", resetPasswordLimiter, recupass);
routes.post("/reset-password/:token", authenticate, resetPassword);
routes.post("/posts", authenticate, new_dossier);
routes.post(
    "/newuser",
    [
        body("nomComplet").notEmpty().withMessage("Le nom complet est obligatoire."),
        body("nomUtilisateur").notEmpty().withMessage("Le nom d'utilisateur est obligatoire."),
        body("email").isEmail().withMessage("L'email est invalide."),
        body("motDePasse")
            .isLength({ min: 8 }).withMessage("Le mot de passe doit contenir au moins 8 caractères.")
            .matches(/[A-Z]/).withMessage("Le mot de passe doit contenir au moins une majuscule.")
            .matches(/[a-z]/).withMessage("Le mot de passe doit contenir au moins une minuscule.")
            .matches(/\d/).withMessage("Le mot de passe doit contenir au moins un chiffre.")
            .matches(/[@$!%*?&]/).withMessage("Le mot de passe doit contenir au moins un caractère spécial (@$!%*?&)."),
    ],newuser);

routes.get("/records_de_jours", records_de_jours);
routes.get("/last_id_dossier", last_id_dossier);
routes.get("/search_rs", search_rs);
routes.post("/login", login);
routes.get("/recherche_multiple", authenticate, recherche_multiple);

// 🔹 Routes protégées par `authenticate`
routes.get("/", authenticate, getposts);
routes.get("/:id", authenticate, get_with_Id_dossier);
routes.delete("/:id", authenticate, deletepost);
routes.put("/:p", authenticate, editpost);
routes.post("/ajout_article", authenticate, ajout_article);

module.exports = routes;
