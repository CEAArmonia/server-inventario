const mongoose = require('mongoose')    
const schemaPertenece = mongoose.Schema({
    item : {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Item' 
    },

    cantidad: {
        type: Number,
        default: 0,
    },

    fecha: {
        type: Date,
        default: Date.now()
    },

    fecha_retorno: {
        type: Date,
        default: null
    },

    retornado: {
        type: Boolean,
        default: false
    },

    dependencia: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dependencia'
    }
})

module.exports =  mongoose.model( 'Pertenece' , schemaPertenece)