const { Client, User } = require("../models/model");

module.exports.setPosts = async (req, res) => {
    try {
        const data = req.body;
        // Vérifier si `req.body` est vide
        if (!data || Object.keys(data).length === 0) {
            return res.status(400).send("Le corps de la requête est vide. Veuillez ajouter des données.");
        }

        // Si `data` contient des données, on les traite
        const post = Client.create({
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
    try {
        const {nomComplet,nomUtilisateur,email,motDePasse}=req.body;
        // Vérifier si `req.body` est vide
        if (!req.body || Object.keys(req.body).length === 0){
            return res.status(400).send("Le corps de la requête est vide. Veuillez ajouter des données.");
        }
        const existingUser = await User.findOne({ $or: [{ nomUtilisateur }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: "Le nom d'utilisateur ou l'email est déjà utilisé." });
        }
        const newUser = User.create({
            nomComplet: req.body.nomComplet,
            nomUtilisateur: req.body.nomUtilisateur,
            email: req.body.email,
            motDePasse: req.body.motDePasse,
        });
        res.status(200).send("Enregistrement Ajouter avec succèss.");
        
    }
    catch (err) {
        res.status(500).send("Une erreur est survenue.");
    }
};

module.exports.getusers = async (req, res) => {
    try {
        const getuser = await User.find();
        res.status(200).json(getuser);
    }
    catch (err) {
        res.status(500).send("Une erreur est survenue.");
    }
}