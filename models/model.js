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

// Schéma pour les articles
const articleSchema = new mongoose.Schema({
    id_article: {
        type: String,
        unique: true
    },
    designation: {
        type: String,
        required: true,
        trim: true
    },
    unite: {
        type: String,
        required: true,
        enum: ["m²", "m3", "ml", "unite"]
    },
    prix_ht: {
        type: Number,
        required: true,
        min: 0
    },
    rubrique: {
        type: String,
        required: true,
        enum: ["terrassement", "canalisations", "pièces spéciales", "cautionnements", "autres"]
    },
    materiau: {
        type: String,
        required: false,
        enum: ["cuivre", "pvc", "per", "pehd", "multicouche", "galvanisé", "fonte", "inox", "laiton", "autre"]
    },
    diametre: {
        type: Number,
        required: function () {
            return this.unite === "ml";
        }
    },
    prix: [
        {
            annee: { type: Number, required: true }, // Année d'application des prix
            prix_fourniture: { type: Number, required: function () { return ["canalisations", "pièces spéciales", "compteurs"].includes(this.rubrique); }, min: 0 },
            prix_pose: { type: Number, required: function () { return ["canalisations", "pièces spéciales", "compteurs"].includes(this.rubrique); }, min: 0 }
        }
    ],

}, {
    timestamps: true
});

// Création des modèles
const Client = mongoose.model("Client", postSchema);
const User = mongoose.model("User", userSchema);
const Article = mongoose.model("Article", articleSchema);


// Export des modèles
module.exports = { Client, User, Article };