const model = require("../models/model");
const ClientPost = require("../models/model");

module.exports.setPosts = async (req, res) => {
    try {
        const data = req.body;
        // Vérifier si `req.body` est vide
        if (!data || Object.keys(data).length === 0) {
            return res.status(400).send("Le corps de la requête est vide. Veuillez ajouter des données.");
        }

        // Si `data` contient des données, on les traite
        const post = ClientPost.create({
            Id_Client: req.body.Id_Client,
            raison_sociale: req.body.raison_sociale,
            Adresse: req.body.Adresse,
            email: req.body.email
        });
        res.status(200).send("Enregistrement Ajouter avec succèss");
    }
    catch (err) {
        res.status(500).send("Une erreur est survenue.");
    }

};

module.exports.editpost = async (req, res) => {
    try {
        const id = await ClientPost.findById(req.params.p);
        // Vérifier si `req.params` est vide
        if (!id) {
            return res.status(400).send("L'Id n'existe pas.");
        }
        const updatepost = await ClientPost.findByIdAndUpdate(
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
        if (!res.status == 200) {
            return res.status(400).send("Une erreur est survenue");
        }
        const getpost = await ClientPost.find();
        //res.status(200).send("Récupération effectuer success.");
        res.status(200).json(getpost);
        
    }
    catch (err) {
        res.status(500).send("Une erreur est survenue.");
    }
}
