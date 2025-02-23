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
        required: false,
        min: 0
    },
    rubrique: {
        type: String,
        required: true,
        enum: ["terrassement", "canalisations", "pièces spéciales", "cautionnements", "autres"]
    },
    materiau: {
        type: String,
        enum: ["cuivre", "pvc", "per", "pehd", "multicouche", "galvanisé", "fonte", "inox", "laiton", "autre"]
    },
    diametre: {
        type: Number,
        validate: {
            validator: function (value) {
                return this.unite !== "ml" || (this.unite === "ml" && value != null);
            },
            message: "Le diamètre est requis si l'unité est en mètres linéaires (ml)."
        }
    },
    prix: [
        {
            annee: { type: Number, required: true }, // Année d'application des prix
            prix_achat_ht: {
                type: Number,
                required: true,
                min: 0,
            },
            prix_fourniture: {
                type: Number,
                min: 0,
                required: function () {
                    return ["canalisations", "pièces spéciales", "compteurs"].includes(this.rubrique);
                }
            },
            prix_pose: {
                type: Number,
                min: 0,
                required: function () {
                    return ["canalisations", "pièces spéciales", "compteurs"].includes(this.rubrique);
                }
            }
        }
    ],

}, {
    timestamps: true
});

// 🔥 Ajouter un middleware pour générer `id_article` avant l'enregistrement
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