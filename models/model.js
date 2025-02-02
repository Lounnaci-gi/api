const mongoose = require("mongoose");

// Schéma pour les clients
const postSchema = mongoose.Schema(
    {
        Id_Dossier: {
            type: String,
            required: true,
            unique: true,
        },
        raison_sociale: {
            type: String,
            required: true,
        },
        Adresse_correspondante: { // Modification du nom du champ
            type: String,
            required: true,
        },
        commune_correspondante: { // Modification du nom du champ
            type: String,
            required: true,
        },
        Num_pic_identite: { // Nouveau champ
            type: String,
            required: false,
        },
        Adresse_branchement: { // Nouveau champ
            required: true,
            type: String,
        },
        commune_branchement: { // Modification du nom du champ
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: false,
        },
        telephone: {
            type: String,
            required: false,
        },
        type_client: {
            type: String,
            required: true,
        },
        // Ajoutez d'autres champs si nécessaire pour type_client
    },
    {
        timestamps: true, // Ajoute automatiquement les champs createdAt et updatedAt
    }
);


// Schéma pour les utilisateurs (inchangé)
const userSchema = mongoose.Schema(
    {
        nomComplet: {
            type: String,
            required: true,
        },
        nomUtilisateur: {
            type: String,
            required: true,
            unique: true, // Le nom d'utilisateur doit être unique
        },
        email: {
            type: String,
            required: true,
            unique: true, // L'email doit être unique
        },
        motDePasse: {
            type: String,
            required: true,
        },
        resetToken: {
            type: String, // Champ pour stocker le token de réinitialisation
            default: null, // Valeur par défaut
        },
        resetTokenExpire: {
            type: Date, // Champ pour stocker la date d'expiration du token
            default: null, // Valeur par défaut
        },
    },
    {
        timestamps: true, // Ajoute automatiquement les champs createdAt et updatedAt
    }
);

// Création des modèles
const Client = mongoose.model("Client", postSchema);
const User = mongoose.model("User", userSchema);

// Export des modèles
module.exports = { Client, User };