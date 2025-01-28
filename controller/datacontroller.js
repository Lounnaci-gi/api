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

        if (!req.params.id == "") {
            const nombre = await Client.findOne({ Id_Client: req.params.id });
            if (nombre.length > 0) {
                res.status(200).json(nombre);
            } else {
                res.send(`Aucun enregistrement Trouvès ne coorespond a l'id : ` + req.params.id);
            }
        } else {
            res.send('Veuillez Fournir un Id_Client');
        }
    } catch (err) {
        res.status(400).send(`Impossible d'accéder a l'enregistrement.`);

    }
}

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
        const data = req.body;
        // Vérifier si `req.body` est vide
        if (!data || Object.keys(data).length === 0) {
            return res.status(400).send("Le corps de la requête est vide. Veuillez ajouter des données.");
        }

        // Si `data` contient des données, on les traite
        const post = User.create({
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