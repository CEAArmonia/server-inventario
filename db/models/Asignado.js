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
    }
})

module.exports = mongoose.model('Asignado', schemaAsignado)