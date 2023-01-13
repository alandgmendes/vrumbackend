const mongoose = require("mongoose");

// user schema
const SorteioSchema = new mongoose.Schema({
    
    
    Descricao: {
        type: String,
    },

    IdPremio: {
        type: String,
    },
    
    DataSorteio: {
        type: String,
    },
});

// export programaSchema
module.exports = mongoose.model.Sorteios || mongoose.model("Sorteios", SorteioSchema);
