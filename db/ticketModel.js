const mongoose = require("mongoose");

// user schema
const TicketSchema = new mongoose.Schema({
    
    
    Descricao: {
        type: String,
    },

    IdSorteio: {
        type: String,
    },

    IdSorteado: {
        type: String,
    }
    
    
   
    });

// export programaSchema
module.exports = mongoose.model.Tickets || mongoose.model("Tickets", TicketSchema);
