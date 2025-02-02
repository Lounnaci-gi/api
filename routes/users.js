const express = require("express");
const routes = express.Router();
const { body, validationResult } = require("express-validator");
const { setPosts, editpost, getposts, get_with_Id_dossier, deletepost, newuser, getuser, recupass, last_id_dossier } = require("../controller/datacontroller");


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
routes.get("/last_id_dossier", last_id_dossier); // Correction de la route pour récupérer l'ID dossier
//routes.get("/getuser", last_id_dossier); // Route spécifique pour récupérer tous les utilisateurs
routes.post("/getuser", getuser); // Route spécifique pour récupérer tous les utilisateurs


// Les routes dynamiques doivent venir après
routes.get("/", getposts);
routes.get("/:id", get_with_Id_dossier); // Route dynamique pour récupérer un client par ID
routes.delete("/:id", deletepost);
routes.put("/:p", editpost);

module.exports = routes;