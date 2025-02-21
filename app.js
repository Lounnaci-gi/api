const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const users = require("./routes/users.js");
const connectdb = require("./config/db.js");
const dotenv = require("dotenv").config();
//--Connexion a mongodb
connectdb();

const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Maximum 5 tentatives par IP
    message: { success: false, message: "Trop de tentatives de connexion. Veuillez réessayer plus tard." },
});

app.use("/users/login", loginLimiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, "Front")));
app.use("/users", users);


app._router.stack.forEach((middleware) => {
    if (middleware.route) {
        const methods = Object.keys(middleware.route.methods).join(", ").toUpperCase();
        console.log(`✅ Route enregistrée: [${methods}] ${middleware.route.path}`);
    }
});


app.listen(port, () => {
    console.log(`le serveur est lancé sur le port: http://localhost:${port}`);
})