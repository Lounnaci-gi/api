const express = require("express");
const routes = express.Router();
const {setPosts, editpost, getposts,getpost_with_id} = require("../controller/datacontroller");

routes.get("/", getposts);

routes.get("/:p/:s", (req, res) => {
    res.send(`Ce c'est est un get avec deux paramètres : (${req.params.p} et ${req.params.s})`);
});

routes.post("/posts",setPosts);
routes.put("/:p",editpost);
routes.get("/",getposts);
routes.get("/:id",getpost_with_id);


module.exports = routes;