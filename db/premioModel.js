const mongoose = require("mongoose");

// user schema
const PremioSchema = new mongoose.Schema({
    
    
    Descricao: {
        type: String,
    },

    Imagem: {
        type: String,
    },
    
    Titulo: {
        type: String,
    }
});

// export programaSchema
module.exports = mongoose.model.Premios || mongoose.model("Premios", PremioSchema);
