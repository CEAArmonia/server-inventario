const mongoose = require('mongoose')    
const schemaDependencia = mongoose.Schema({
    nombre : {
        type : String,
        default : 'nombre dependencia',
    },

    desc: {
        type: String,
        default:'descripcion'
    }
})
module.exports =  mongoose.model( 'Dependecia' , schemaDependencia)