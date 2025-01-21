const express = require("express");
const routes = express.Router();
const {setPosts, editpost, getposts, get_with_id_client} = require("../controller/datacontroller");

routes.get("/", getposts);
routes.put("/:p",editpost);
routes.post("/posts",setPosts);
routes.get("/:id", get_with_id_client);

routes.get("/:p/:s", (req, res) => {
    res.send(`Ce c'est est un get avec deux paramètres : (${req.params.p} et ${req.params.s})`);
});



module.exports = routes;