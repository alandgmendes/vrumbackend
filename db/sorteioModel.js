import mongoose from 'mongoose';
const { Schema } = mongoose;

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
