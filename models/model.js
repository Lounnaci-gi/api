const mongoose = require("mongoose");

// Schéma pour les clients
const postSchema = mongoose.Schema(
    {
        Id_Dossier: {
            type: String,
            required: true,
            unique: true,
        },
        Civilite: {
            type: String,
            required: true,
        },
        raison_sociale: {
            type: String,
            required: true,
        },
        Adresse_correspondante: { // Modification du nom du champ
            type: String,
            required: true,
        },
        Code_postale: {
            type: Number,
        },
        commune_correspondante: { // Modification du nom du champ
            type: String,
            required: true,
        },
        Num_pic_identite: {
            type: new mongoose.Schema({
                numero: { type: String, required: false }, // Numéro PIC Identité
                delivre_par: { type: String, required: false }, // Autorité qui a délivré
                date_delivrance: { type: Date, required: false }, // Date de délivrance
            }),
            required: false
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


// Schéma pour les utilisateurs
const userSchema = mongoose.Schema(
    {
        nomComplet: { type: String, required: true },
        nomUtilisateur: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        motDePasse: { type: String, required: true },
        role: {
            type: String,
            enum: ["admin", "chef_centre", "chef_agence", "chef_tech_com", "juriste", "utilisateur"], // 🔥 6 rôles
            default: "utilisateur" // L'utilisateur de base a un accès limité
        },
        resetToken: { type: String, default: null },
        resetTokenExpire: { type: Date, default: null },
    },
    { timestamps: true }
);


//Schéma pour les articles

const articleSchema = mongoose.Schema({
    id_article: {
        type: String,
        unique: true,

    },
    designation: {
        type: String,
        required: true,
        trim: true
    },
    rubrique: {
        type: String,
        required: true,
        enum: ["terrassement", "canalisations", "pieces_speciales", "cautionnements", "autres"]
    },
    materiau: {
        type: String,
        enum: ["cuivre", "pvc", "per", "pehd", "multicouche", "galvanisé", "fonte", "inox", "laiton", "autre"]
    },
    prix: [
        {
            date_application: { type: Date, default: Date.now },
            prix_unitaire_ht: { type: Number, required: true, min: 0 },
            prix_fourniture: { type: Number, min: 0 },
            prix_pose: { type: Number, min: 0 }
        }
    ],
    // 🔥 Ajout des caractéristiques techniques
    caracteristiques: {
        type: Map, // Utilisation d'un Map pour stocker des paires clé-valeur dynamiques
        of: String // Les valeurs peuvent être des chaînes de caractères (ou d'autres types si nécessaire)
    }
}, {
    timestamps: true
});


// Création des modèles
const Client = mongoose.model("Client", postSchema);
const User = mongoose.model("User", userSchema);
const Article = mongoose.model("Article", articleSchema);


// Export des modèles
module.exports = { Client, User, Article };