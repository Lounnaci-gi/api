const { Client, User, Article } = require("../models/model");
const bcrypt = require('bcryptjs');
const { validationResult } = require("express-validator");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv").config();
const moment = require("moment");
const jwt = require("jsonwebtoken");

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
        //res.status(200).send("Récupération effectuer success.");
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
    try {
        if (req.params.id === "") {
            return res.status(400).send(`Ajouter l'id de Client !`);
        } else {
            const post = await Client.findOne({ Id_Dossier: req.params.id });
            if (!post) {
                return res.status(404).send(`Aucun enregistrement trouvé avec l'id : ` + req.params.id);
            } else {
                await post.deleteOne();
                res.status(200).send(`Enregistrement supprimer avec succes`);
            }
        }

    } catch (err) {
        res.status(500).send(`Impossible de ce connecté a l'enregistrement.`);
    }
}
//-----------Ajouter des utilisateurs ---------------------------------------------------


module.exports.newuser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    try {
        const { nomComplet, nomUtilisateur, email, motDePasse } = req.body;

        // Vérifier si `req.body` est vide
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ success: false, message: "Le corps de la requête est vide. Veuillez ajouter des données." });
        }

        // Vérifier si l'utilisateur ou l'email existe déjà
        const existingUser = await User.findOne({ $or: [{ nomUtilisateur }, { email }] });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Le nom d'utilisateur ou l'email est déjà utilisé." });
        }

        // Hasher le mot de passe avant de l'enregistrer
        const salt = await bcrypt.genSalt(10); // Générer un salt
        const hashedPassword = await bcrypt.hash(motDePasse, salt); // Hasher le mot de passe

        // Créer un nouvel utilisateur
        const newUser = await User.create({
            nomComplet,
            nomUtilisateur,
            email,
            motDePasse: hashedPassword, // Utiliser le mot de passe hashé
        });

        // Renvoyer une réponse JSON
        res.status(200).json({ success: true, message: "Enregistrement ajouté avec succès.", data: newUser });
    } catch (err) {
        console.error("Erreur dans newuser :", err); // Log de l'erreur pour le débogage
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

        // ✅ Générer un Token JWT
        const token = jwt.sign(
            { userId: user._id, nomUtilisateur: user.nomUtilisateur },
            process.env.JWT_SECRET || "aa56fedd9bec83dc879255c5454e7656e7b148ff71b3023f09790fa2e59450a8c80491b2495e596e28c760409d7497719e103efbeffeae18744d871a5f4c56f2",  // 🔥 Vérifie que `JWT_SECRET` est défini dans `.env`
            { expiresIn: "7d" }  // Expiration du token en 1 heure
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
    const { email } = req.body; // Extraction de l'e-mail de la requête

    try {
        // Recherche de l'utilisateur dans la base de données
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: `Utilisateur non trouvé.` }); // Si l'utilisateur n'existe pas, renvoyer une erreur 404
        }
        // Génération d'un token de réinitialisation (valide 1h)
        const resetToken = crypto.randomBytes(32).toString("hex"); // Génère un token aléatoire
        user.resetToken = resetToken; // Associe le token à l'utilisateur
        user.resetTokenExpire = Date.now() + 3600000; // Définit l'expiration à 1 heure
        await user.save(); // Sauvegarde les modifications dans la base de données
        // Création du lien de réinitialisation
        const resetLink = `http://localhost:3000/users/reset-password/${resetToken}`;

        // Envoi de l'e-mail avec le lien de réinitialisation
        console.log("Tentative d'envoi d'e-mail à :", user.email);
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Réinitialisation du mot de passe",
            text: `Cliquez sur le lien suivant pour réinitialiser votre mot de passe : ${resetLink}`,
        });

        // Réponse indiquant que l'e-mail a été envoyé
        res.json({
            message: `Un e-mail de réinitialisation a été envoyé à ${user.email}.`,
            email: user.email // Ajouter l'email pour l'afficher côté frontend
        });


    } catch (err) {
        console.error("Erreur dans recupass :", err); // Affiche l'erreur complète
        res.status(500).json({ message: "Erreur serveur." });
    }
}

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


