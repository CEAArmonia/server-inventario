const mongoose = require('mongoose')
const schemaAsignado = mongoose.Schema({
    fecha: {
        type: Date,
        default: Date.now()
    },

    responsableId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Responsable'
    },

    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item'
    },

    cantidad: {
        type: Number,
        default: 0
    },

    retornado: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('Asignado', schemaAsignado)