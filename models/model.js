const mongoose = require("mongoose");

const postSchema = mongoose.Schema(
    {
        Id_Client: {
            type: String,
            required: true
        },
        raison_sociale: {
            type: String,
            required: true
        },
        Adresse: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

// Schéma pour les utilisateurs
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
    },
    {
        timestamps: true, // Ajoute automatiquement les champs createdAt et updatedAt
    }
);

// Export du modèle User

// Création des modèles
const Client = mongoose.model("Client", postSchema);
const User = mongoose.model("User", userSchema);

// Export des modèles
module.exports = { Client, User };