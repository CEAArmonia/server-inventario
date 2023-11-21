const mongoose = require('mongoose')
const schemaUsuario = mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'nombre requerido']
    },

    telefono: {
        type: String,
        default: '00000000'
    },

    ci: {
        type: String,
        required: [true, 'ci obligatorio']
    },

    password: {
        type: String,
        required: [true, 'password obligatorio']
    },

    administrador: {
        type: Boolean,
        default: false
    },

    activo: {
        type: Boolean,
        default: false,
    },

    bitacoras: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bitacora'
    }]

})
module.exports = mongoose.model('Usuario', schemaUsuario)