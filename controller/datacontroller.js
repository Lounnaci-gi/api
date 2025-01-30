const { Client, User } = require("../models/model");
const bcrypt = require('bcrypt');
const { validationResult } = require("express-validator");

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
            Adresse: req.body.Adresse,
            email: req.body.email
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