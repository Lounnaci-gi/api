const { Client, User, Article } = require("../models/model");
const bcrypt = require('bcryptjs');
const { validationResult } = require("express-validator");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv").config();
const moment = require("moment");
const jwt = require("jsonwebtoken");
const authenticate = require("../middlewares/auth");



module.exports.new_dossier = async (req, res) => {
    try {
        const data = req.body;
        // Vérifier si `req.body` est vide
        if (!data || Object.keys(data).length === 0) {
            return res.status(400).send("Le corps de la requête est vide. Veuillez ajouter des données.");
        }
        // Vérifier si Num_pic_identite est bien structuré
        const numPicIdentite = req.body.Num_pic_identite || {};

        // Si `data` contient des données, on les traite
        const post = await Client.create({
            Id_Dossier: req.body.Id_Dossier,
            Civilite: req.body.Civilite,
            raison_sociale: req.body.raison_sociale,
            Adresse_correspondante: req.body.Adresse_correspondante,
            commune_correspondante: req.body.commune_correspondante,
            Code_postale: req.body.Code_postale,
            /*  Num_pic_identite: req.body.Num_pic_identite,*/
            Num_pic_identite: {
                numero: numPicIdentite.numero || "", // Assigner un champ vide si absent
                delivre_par: numPicIdentite.delivre_par || "",
                date_delivrance: numPicIdentite.date_delivrance || null
            },
            Adresse_branchement: req.body.Adresse_branchement,
            commune_branchement: req.body.commune_branchement,
            email: req.body.email,
            telephone: req.body.telephone,
            type_client: req.body.type_client
        });
        res.status(200).send("Enregistrement Ajouter avec succèss.");
    }
    catch (err) {
        res.status(500).send("Une erreur est survenue.");
    }

};

module.exports.editpost = async (req, res) => {
    try {
        const idDossier = decodeURIComponent(req.params.p); // Décoder l'URL

        // Vérifier si l'ID est valide
        if (!idDossier) {
            return res.status(400).send("❌ L'ID est requis.");
        }

        // Vérifier si l'ID existe dans la base de données
        const existingClient = await Client.findOne({ Id_Dossier: idDossier });
        if (!existingClient) {
            console.log("⚠️ Client introuvable :", idDossier);
            return res.status(404).send("❌ L'ID spécifié n'existe pas.");
        }

        // Mettre à jour le document
        const updatepost = await Client.findOneAndUpdate(
            { Id_Dossier: idDossier },
            req.body,
            { new: true }
        );

        if (!updatepost) {
            console.log("🚨 Mise à jour impossible :", idDossier);
            return res.status(500).send("❌ Échec de la mise à jour.");
        }

        res.status(200).send("✅ Mise à jour effectuée avec succès.");
    } catch (err) {
        console.error("❌ Erreur lors de la mise à jour :", err);
        res.status(500).send("Une erreur est survenue.");
    }
};


module.exports.getposts = async (req, res) => {
    try {
        const getpost = await Client.find();
        res.status(200).json(getpost);
    }
    catch (err) {
        res.status(500).send("Une erreur est survenue.");
    }
}

module.exports.get_with_Id_dossier = async (req, res) => {
    try {
        if (req.params.id === "") {
            return res.status(400).send('Veuillez Fournir un Id_dossier');
        }
        // Recherche du client dans la base de données
        const client = await Client.findOne({ Id_Dossier: req.params.id });

        if (client) {
            // Si le client est trouvé, on renvoie les données
            res.status(200).json(client);
        } else {
            // Si aucun client n'est trouvé pour l'ID donné
            res.status(404).send(`Aucun enregistrement trouvé ne correspond à l'ID : ${req.params.id}`);
        }
    } catch (err) {
        // En cas d'erreur lors de l'accès à la base de données
        res.status(400).send(`Impossible d'accéder à l'enregistrement.`);
    }
};

module.exports.recherche_multiple = async (req, res) => {
    try {
        const query = req.query.q?.trim(); // Suppression des espaces inutiles

        if (!query) {
            return res.status(400).json({ error: 'Aucun critère de recherche fourni.' });
        }

        // Création du filtre de recherche insensible à la casse
        const searchRegex = new RegExp(query, 'i');

        const clients = await Client.find({
            $or: [
                { Id_Dossier: { $regex: searchRegex } },  // Corrige pour s'assurer que c'est un regex
                { raison_sociale: { $regex: searchRegex } },
                { telephone: { $regex: searchRegex } }
            ]
        }).limit(20);// 🔥 Limiter à 20 résultats max

        if (clients.length === 0) {
            return res.json([]); // Renvoie un tableau vide si aucun client trouvé
        }

        res.json(clients);
    } catch (err) {
        console.error("Erreur serveur:", err);
        res.status(500).json({ error: 'Erreur serveur, veuillez réessayer plus tard.' });
    }
};

module.exports.deletepost = async (req, res) => {
    authenticate(req, res, async () => {
        try {
            if (!req.params.id) {
                return res.status(400).send("Ajoutez l'ID du client !");
            }

            const post = await Client.findOne({ Id_Dossier: req.params.id });
            if (!post) {
                return res.status(404).send(`Aucun enregistrement trouvé avec l'ID : ${req.params.id}`);
            }

            await post.deleteOne();
            res.status(200).send("Enregistrement supprimé avec succès.");

        } catch (err) {
            res.status(500).send("Erreur lors de la suppression.");
        }
    });
};

//-----------Ajouter des utilisateurs ---------------------------------------------------
module.exports.newuser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
        const { nomComplet, nomUtilisateur, email, motDePasse, role, secretCode } = req.body;

        const existingAdmin = await User.findOne({ role: "admin" });
        // Vérifier si un admin existe déjà
        if (role === "admin" && existingAdmin) {
            return res.status(403).json({ message: "Un admin existe déjà. Impossible d'en créer un autre." });
        }
        // Vérifier si l'email correspond à celui défini dans .env
        if (role === "admin" && email !== process.env.ADMIN_EMAIL) {
            return res.status(403).json({ message: "Seul l'administrateur désigné peut créer un compte admin." });
        }
        // Vérifier le code secret si besoin
        if (role === "admin" && secretCode !== process.env.ADMIN_SECRET) {
            return res.status(403).json({ message: "Code secret incorrect. Création d'admin refusée." });
        }

        // Vérifier si l'utilisateur ou l'email existe déjà
        const existingUser = await User.findOne({ $or: [{ nomUtilisateur }, { email }] });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Le nom d'utilisateur ou l'email est déjà utilisé." });
        }

        // Hasher le mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(motDePasse, salt);

        // Créer un nouvel utilisateur avec un rôle défini
        const newUser = await User.create({
            nomComplet,
            nomUtilisateur,
            email,
            motDePasse: hashedPassword,
            role: role || "utilisateur" // 🔥 Par défaut, l’utilisateur a un accès limité
        });

        res.status(200).json({ success: true, message: "Utilisateur ajouté avec succès.", data: newUser });
    } catch (err) {
        console.error("Erreur dans newuser :", err);
        res.status(500).json({ success: false, message: "Une erreur est survenue lors de la création de l'utilisateur." });
    }
};


module.exports.login = async (req, res) => {
    try {
        const { nomUtilisateur, motDePasse } = req.body;
        // Trouver l'utilisateur par nom d'utilisateur
        const user = await User.findOne({ nomUtilisateur });

        // Vérifier si l'utilisateur existe
        if (!user) {
            return res.status(401).json({ success: false, message: "Nom d'utilisateur ou mot de passe incorrect." });
        }

        // Comparer le mot de passe fourni avec le mot de passe hashé
        const isPasswordValid = await bcrypt.compare(motDePasse, user.motDePasse);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: "Nom d'utilisateur ou mot de passe incorrect." });
        }

        if (!process.env.JWT_SECRET) {
            throw new Error("❌ JWT_SECRET manquant ! Impossible de générer un token.");
        }

        const token = jwt.sign(
            { userId: user._id, nomUtilisateur: user.nomUtilisateur },
            process.env.JWT_SECRET, // 🔒 Utiliser uniquement la variable d'environnement
            { expiresIn: "1h" } // ⏳ Réduit la durée de validité à 1 heure
        );


        // ✅ Renvoyer le token et les infos utilisateur
        res.status(200).json({
            success: true, token, data: {
                nomUtilisateur: user.nomUtilisateur,
                email: user.email,
                nomComplet: user.nomComplet
            }
        });

    } catch (err) {
        console.error("Erreur de Connexion :", err);
        res.status(500).json({ success: false, message: "Une erreur est survenue lors de la connexion." });
    }
};

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER, // Utilisez la variable d'environnement
        pass: process.env.EMAIL_PASSWORD, // Utilisez la variable d'environnement
    },
    tls: {
        rejectUnauthorized: false, // Ignore les erreurs SSL
    }
});

module.exports.recupass = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: `Utilisateur non trouvé.` });
        }

        // 🔒 Générer un token et stocker sa version hachée
        const resetToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

        user.resetToken = hashedToken; // ✅ Stocker la version hachée du token
        user.resetTokenExpire = Date.now() + 3600000; // Expire après 1h
        await user.save();

        // 📩 Envoyer le token brut par email (car en base, on stocke uniquement la version hachée)
        const resetLink = `http://localhost:3000/users/reset-password/${resetToken}`;

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Réinitialisation du mot de passe",
            text: `Cliquez sur le lien suivant pour réinitialiser votre mot de passe : ${resetLink}`,
        });

        res.json({
            message: `Un e-mail de réinitialisation a été envoyé à ${user.email}.`
        });

    } catch (err) {
        console.error("Erreur dans recupass :", err);
        res.status(500).json({ message: "Erreur serveur." });
    }
};
//-----------Reset password------------------------------------------------------------------------
module.exports.resetPassword = async (req, res) => {
    const { token } = req.params; // Token envoyé dans l'URL
    const { newPassword } = req.body; // Nouveau mot de passe soumis

    try {
        if (!newPassword || newPassword.length < 8) {
            return res.status(400).json({ message: "Le mot de passe doit contenir au moins 8 caractères." });
        }

        // 🔍 Hacher le token reçu pour le comparer avec la version stockée
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        // 📌 Vérifier si l'utilisateur existe avec ce token et qu'il n'a pas expiré
        const user = await User.findOne({
            resetToken: hashedToken,
            resetTokenExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Token invalide ou expiré." });
        }

        // 🔒 Hasher le nouveau mot de passe avant de l'enregistrer
        const salt = await bcrypt.genSalt(10);
        user.motDePasse = await bcrypt.hash(newPassword, salt);

        // 📌 Mettre à jour les informations utilisateur avant la sauvegarde
        user.tokenVersion = (user.tokenVersion || 0) + 1; // 🔥 Invalider les anciens JWT
        user.resetToken = undefined; // Supprime le token de réinitialisation
        user.resetTokenExpire = undefined;
        await user.save(); // ✅ Un seul `save()`

        // 📩 Envoyer un email de confirmation
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Votre mot de passe a été réinitialisé",
            text: "Bonjour,\n\nVotre mot de passe a été réinitialisé avec succès. Si vous n'êtes pas à l'origine de cette demande, veuillez contacter notre support immédiatement.\n\nCordialement,\nL'équipe de support",
        });

        // ✅ Répondre au frontend pour forcer la déconnexion
        res.json({
            message: "Mot de passe réinitialisé avec succès ! Vous devez vous reconnecter.",
            forceLogout: true
        });

    } catch (err) {
        console.error("Erreur lors de la réinitialisation du mot de passe :", err);
        res.status(500).json({ message: "Erreur serveur." });
    }
};


//-----------Récupérer le dernier id_dossier -- ---------------------------------------------------
module.exports.last_id_dossier = async (req, res) => {
    const currentYear = moment().format("YYYY");

    try {
        // 🔍 Trouver le dernier Id_Dossier existant pour l'année en cours
        const lastClient = await Client.findOne({ Id_Dossier: new RegExp(`^\\d{4}/CB/${currentYear}$`) })
            .sort({ Id_Dossier: -1 }) // Trier du plus grand au plus petit
            .lean();

        let nextNumber = 1;

        if (lastClient && lastClient.Id_Dossier) {
            // Extraire le numéro et l'incrémenter
            const lastNumber = parseInt(lastClient.Id_Dossier.split("/")[0], 10);
            if (!isNaN(lastNumber)) {
                nextNumber = lastNumber + 1;
            }
        }

        // 📌 Générer le nouvel ID formaté
        const newIdDossier = `${String(nextNumber).padStart(4, "0")}/CB/${currentYear}`;

        res.json({ success: true, idDossier: newIdDossier });

    } catch (error) {
        console.error("❌ Erreur lors de la génération de l'ID dossier :", error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
};

// Rechercher des raisons sociales similaires
module.exports.search_rs = async (req, res) => {

    try {
        const searchTerm = req.query.q;
        if (!searchTerm) {
            return res.status(400).json({ error: "Paramètre de recherche manquant" });
        }

        const clients = await Client.find({ raison_sociale: new RegExp(searchTerm, 'i') }).limit(10);

        res.json(clients);
    } catch (error) {
        console.error("Erreur API:", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }

}

// afficher les enregistrement de jours
module.exports.records_de_jours = async (req, res) => {
    try {
        const { date_debut, date_fin } = req.query; // 🟢 Correction ici (GET request)

        if (!date_debut || !date_fin) {
            return res.status(400).json({ error: "Les deux dates sont requises." });
        }

        // 🟢 Conversion au bon format : YYYY-MM-DD
        // Convertir le format "DD/MM/YYYY" en "YYYY-MM-DD"
        const [jourD, moisD, anneeD] = date_debut.split('/');
        const [jourF, moisF, anneeF] = date_fin.split('/');
        const startDate = new Date(`${anneeD}-${moisD}-${jourD}T00:00:00.000Z`);
        const endDate = new Date(`${anneeF}-${moisF}-${jourF}T23:59:59.999Z`);


        // Vérification si les dates sont valides
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return res.status(400).json({ error: "Dates invalides." });
        }

        // 🟢 Requête MongoDB pour filtrer les enregistrements par `createdAt`
        const clients = await Client.find({
            createdAt: { $gte: startDate, $lte: endDate }
        }).sort({ createdAt: 1 });

        return res.json(clients);

    } catch (error) {
        console.error("Erreur serveur :", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
};
//-Routes des Articles--------------------------------------------------------------------------------
module.exports.ajout_article = async (req, res) => {
    try {
        const informations = req.body;

        const prix = informations.prix && informations.prix.length > 0 ? informations.prix : [];
        const caracteristiques = informations.caracteristiques && Object.keys(informations.caracteristiques).length > 0
            ? informations.caracteristiques
            : {};

        // Générer un id_article unique
        const lastArticle = await Article.findOne({ id_article: /^ART\d{7}$/ })
            .sort({ id_article: -1 })
            .lean();

        let nextNumber = 1;
        if (lastArticle && lastArticle.id_article) {
            const match = lastArticle.id_article.match(/^ART(\d{7})$/);
            if (match) {
                nextNumber = parseInt(match[1], 10) + 1;
            }
        }
        const newIdArticle = `ART${String(nextNumber).padStart(7, "0")}`;

        // Créer un nouvel article sans générer l'id ici (géré par Mongoose)
        const nouvelArticle = new Article({
            id_article: newIdArticle,
            designation: informations.designation,
            materiau: informations.materiau,
            rubrique: informations.rubrique,
            prix: prix,
            caracteristiques: caracteristiques
        });

        // Sauvegarde pour déclencher le middleware `pre("save")`
        await nouvelArticle.save();

        res.status(201).json({ message: "Article ajouté avec succès", article: nouvelArticle });

    } catch (err) {
        console.error("Erreur lors de l'ajout de l'article :", err);
        res.status(500).json({ message: "Erreur serveur." });
    }
};


//-Mise a jour des prix d'article--------
// module.exports.update_article = async (req, res) => {
//     try {
//         const { id_article, prix } = req.body;

//         const article = await Article.findOne({ id_article });
//         if (!article) {
//             return res.status(404).json({ message: "Article non trouvé" });
//         }

//         // Ajouter le nouveau prix à l'historique
//         article.prix.push({
//             date_application: new Date(), // ✅ Enregistrer la date d'application
//             prix_achat_ht: prix.prix_achat_ht,
//             prix_fourniture: prix.prix_fourniture,
//             prix_pose: prix.prix_pose
//         });

//         await article.save();
//         res.status(200).json({ message: "Article mis à jour avec succès", article });
//     } catch (err) {
//         console.error("Erreur mise à jour article :", err);
//         res.status(500).json({ message: "Erreur serveur." });
//     }
// };


