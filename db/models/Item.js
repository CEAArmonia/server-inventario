const mongoose = require('mongoose')
const schemaItem = mongoose.Schema({
    codigo: {
        type: String,
        default: 'default txt',
    },

    nombre: {
        type: Number,
        default: 'nombre de producto'
    },

    desc: {
        type: String,
        default: 'Item registrado'
    },

    fechaCompra: {
        type: Date,
        default: Date.now()
    },

    valor: {
        type: Number,
        default: 0.0
    },

    estado: {
        type: Boolean,
        default: true
    },

    obs: {
        type: String,
    },

    periodoMant: {
        type: Number,
        default: 3
    },

    tiempoVida: {
        type: Number,
        default: 1
    },

    mantenimientos: [{
        type: Date,
    }],

    tipo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TipoItem'
    }
})

module.exports = mongoose.model('Item', schemaItem)