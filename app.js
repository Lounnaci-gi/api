const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const users = require("./routes/users.js");
const connectdb = require("./config/db.js");
const dotenv = require("dotenv").config();

// Connexion à MongoDB
connectdb();

// Middlewares généraux
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, "Front")));

// Routes
app.use("/users", users); // Montez les routes utilisateurs

// Middleware d'erreurs global (DOIT être le dernier)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: "Une erreur technique est survenue.",
    });
});

// Démarrage du serveur
app.listen(port, () => {
    console.log(`Le serveur est lancé sur le port: http://localhost:${port}`);
});