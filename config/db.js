const mongoose = require("mongoose");

const connectdb = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("❌ La variable d'environnement MONGO_URI est manquante !");
        }
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connecté à MongoDB");
    } catch (error) {
        console.error("❌ Erreur de connexion à MongoDB :", error.message);

        // Vérifier si l'erreur est liée à l'absence d'Internet
        if (error.message.includes("ENOTFOUND")) {
            console.error("❗ Vérifiez votre connexion Internet et relancez l'application.");
            global.internetAbsent = true; // Stocke cette info pour l'envoyer au frontend
        }
    }
};

module.exports = connectdb;
