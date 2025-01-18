const express = require("express");
const routes = express.Router();
const {setPosts, editpost} = require("../controller/datacontroller");

routes.get("/", (req, res) => {
    res.json({
        nom: "Lounnaci",
        prenom: "Ahmed",
        message: "Ce c'est est un get"
    });
})

routes.get("/:p/:s", (req, res) => {
    res.send(`Ce c'est est un get avec deux paramètres : (${req.params.p} et ${req.params.s})`);
});

routes.put("/:p",editpost);
routes.post("/posts",setPosts);


module.exports = routes;