const mongoose = require('mongoose')    
const schemaBitacora = mongoose.Schema({
    fecha : {
        type : Date,
        default : Date.now(),
    },

    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Usuario',
    }
    
})
module.exports =  mongoose.model( 'Bitacora' , schemaBitacora)