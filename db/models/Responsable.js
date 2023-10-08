const mongoose = require('mongoose')    
const schemaResponsable = mongoose.Schema({
    nombre : {
        type : String,
        required:[true, 'campo nombre requerido']
    },

    ci: {
        type: String,
        required:[true,'El campo CI es obligatorio']
    },

    cargo: {
        type:String,
    },

    telefono: {
        type: String,

    }
})
module.exports =  mongoose.model( 'Responsable' , schemaResponsable)