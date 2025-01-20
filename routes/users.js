const express = require("express");
const routes = express.Router();
const {setPosts, editpost, getposts} = require("../controller/datacontroller");

routes.get("/", getposts);

routes.get("/:p/:s", (req, res) => {
    res.send(`Ce c'est est un get avec deux paramètres : (${req.params.p} et ${req.params.s})`);
});

routes.put("/:p",editpost);
routes.post("/posts",setPosts);


module.exports = routes;