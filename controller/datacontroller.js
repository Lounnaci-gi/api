const { Client, User } = require("../models/model");
const bcrypt = require('bcryptjs');
const { validationResult } = require("express-validator");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv").config();

module.exports.setPosts = async (req, res) => {
    try {
        const data = req.body;
        // Vérifier si `req.body` est vide
        if (!data || Object.keys(data).length === 0) {
            return res.status(400).send("Le corps de la requête est vide. Veuillez ajouter des données.");
        }

        // Si `data` contient des données, on les traite
        const post = await Client.create({
            Id_Client: req.body.Id_Client,
            raison_sociale: req.body.raison_sociale,
            Adresse_correspondante: req.body.Adresse_correspondante,
            Num_pic_identite: req.body.Num_pic_identite,
            Adresse_branchement: req.body.Adresse_branchement,
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
        const id = await Client.findById(req.params.p);
        // Vérifier si `req.params` est vide
        if (!id) {
            return res.status(400).send("L'Id n'existe pas.");
        }
        const updatepost = await Client.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        )
        res.status(200).send("mise a jour effectuer success.");
    }
    catch (err) {
        res.status(500).send("Une erreur est survenue.");
    }
}

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

module.exports.get_with_id_client = async (req, res) => {
    try {
        // Vérification si l'ID est fourni
        if (req.params.id === "") {
            return res.status(400).send('Veuillez Fournir un Id_Client');
        }

        // Recherche du client dans la base de données
        const client = await Client.findOne({ Id_Client: req.params.id });

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


module.exports.deletepost = async (req, res) => {
    try {
        if (req.params.id === "") {
            return res.status(400).send(`Ajouter l'id de Client !`);
        } else {
            const post = await Client.findOne({ Id_Client: req.params.id });
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

module.exports.getuser = async (req, res) => {
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

        // Renvoyer les données de l'utilisateur (sans le mot de passe)
        const userData = {
            nomUtilisateur: user.nomUtilisateur,
            email: user.email,
            nomComplet: user.nomComplet,
        };

        res.status(200).json({ success: true, data: userData });
    } catch (err) {
        console.error("Erreur dans getuser :", err);
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
            return res.status(404).json({ message: "Utilisateur non trouvé." }); // Si l'utilisateur n'existe pas, renvoyer une erreur 404
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
        console.log("E-mail envoyé avec succès.");

        // Réponse indiquant que l'e-mail a été envoyé
        res.json({ message: "Un e-mail de réinitialisation a été envoyé." });

    } catch (err) {
        console.error("Erreur dans recupass :", err); // Affiche l'erreur complète
        res.status(500).json({ message: "Erreur serveur." });
    }
}

