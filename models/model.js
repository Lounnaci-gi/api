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

//Schéma pour les articles

const articleSchema = mongoose.Schema({
    id_article: {
        type: String,
        unique: true
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

// 🔥 Middleware pour générer `id_article` avant l'enregistrement
articleSchema.pre("save", async function (next) {
    if (!this.id_article) {
        const lastArticle = await this.constructor.findOne({ id_article: /^ART\d{7}$/ })
            .sort({ id_article: -1 })
            .lean();

        let nextNumber = 1;
        if (lastArticle && lastArticle.id_article) {
            const match = lastArticle.id_article.match(/^ART(\d{7})$/);
            if (match) {
                nextNumber = parseInt(match[1], 10) + 1;
            }
        }
        this.id_article = `ART${String(nextNumber).padStart(7, "0")}`;
    }
    next();
});


// Création des modèles
const Client = mongoose.model("Client", postSchema);
const User = mongoose.model("User", userSchema);
const Article = mongoose.model("Article", articleSchema);


// Export des modèles
module.exports = { Client, User, Article };