const express = require("express");
const routes = express.Router();
const {setPosts, editpost, getposts,get_with_id_client,deletepost,newuser} = require("../controller/datacontroller");



routes.post("/posts",setPosts);
routes.put("/:p",editpost);
routes.get("/",getposts);
routes.get("/:id",get_with_id_client);
routes.delete("/:id",deletepost);
routes.post("/",newuser);


module.exports = routes;