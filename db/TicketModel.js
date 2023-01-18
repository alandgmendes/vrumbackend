import  Schema from 'mongoose';


const TicketSchema = new Schema({
    
    
    Descricao: {
        type: String,
    },

    IdSorteio: {
        type: String,
    },

    Status:{
        type: String,
    },
    IdSorteado:{
        type: String,
    }

});

// export programaSchema
export const TicketModel = model('Ticket', TicketSchema);
