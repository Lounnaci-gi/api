const mongoose = require("mongoose");
const postSchema = mongoose.Schema(
    {
        Id_Client: {
            type: String,
            required: true
        },
        raison_sociale: {
            type: String,
            required: true
        },
        Adresse: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports=mongoose.model('client',postSchema);