const mongoose = require("mongoose");

// user schema
const SorteioSchema = new mongoose.Schema({
    
    
    Descricao: {
        type: String,
    },

    Imagem: {
        type: String,
    },
    Valor: {
        type: String,
    },
});

// export programaSchema
module.exports = mongoose.model.Sorteios || mongoose.model("Sorteios", SorteioSchema);
