const mongoose = require("mongoose");
const connectdb = async () => {
    try {
       await mongoose.connect(process.env.MONGO_URI);
        console.log("Connxion Réussi");
    } 
    catch (err) {
     console.log("Connexion Impossible "+err.message);
     process.exit();
    }  
}

module.exports=connectdb;