const express = require("express");
const app = express();
const port = 3000;
const users = require("./routes/users.js");
const connectdb = require("./config/db.js");
const dotenv = require("dotenv").config();
//--Connexion a mongodb
connectdb();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/users",users);


app.listen(port,()=>{
console.log(`le serveur est lancé sur le port: http://www.localhost:${port}`);
})