const mongoose = require('mongoose')    
const schemaItem = mongoose.Schema({
    name : {
        type : String,
        default : 'default txt',
    },
    
    tamaño: {
        type: Number,
    }
})
module.exports =  mongoose.model( 'Item' , schemaItem)