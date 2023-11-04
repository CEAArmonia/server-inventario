const mongoose = require('mongoose')    
const schemaPertenece = mongoose.Schema({
    itemId : {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Item' 
    },

    cantidad: {
        type: Number,
        default: 0,
    },

    dependenciaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dependencia'
    }
})

module.exports =  mongoose.model( 'Pertenece' , schemaPertenece)