const mongoose = require('mongoose')    
const schemaTipoItem = mongoose.Schema({
    nombre : {
        type : String,
        default : 'nombre de tipo',
    },
})
module.exports =  mongoose.model( 'TipoItem' , schemaTipoItem)