const express = require("express");
const routes = express.Router();
const {setPosts, editpost, getposts,get_with_id_client,deletepost,newuser,getuser} = require("../controller/datacontroller");


// Définir les routes spécifiques AVANT les routes dynamiques
routes.post("/posts", setPosts);
routes.post("/newuser", newuser);
routes.post("/getuser", getuser); // Route spécifique pour récupérer tous les utilisateurs

// Les routes dynamiques doivent venir après
routes.get("/", getposts);
routes.get("/:id", get_with_id_client); // Route dynamique pour récupérer un client par ID
routes.delete("/:id", deletepost);
routes.put("/:p", editpost);

module.exports = routes;