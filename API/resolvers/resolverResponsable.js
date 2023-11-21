
const Responsable = require('../../db/models/Responsable')
const Item = require('../../db/models/Item')
const Asignado = require('../../db/models/Asignado')

const resolverResponsable = {
    Query: {
        obtenerResponsables: async (_, { }) => {
            const responsables = await Responsable.find()
            return responsables
        },

        obtenerResponsablesPorCi: async (_, { ci }) => {
            const responsables = await Responsable
                .find({ci: { $regex: '.*' + ci + '.*'}})
                .sort({ci: 1})
            return responsables
        }
    },

    Mutation: {
        agregarResponsable: async (_, { input }) => {
            const responsable = new Responsable(input)
            try {
                await responsable.save()
                return true
            } catch (error) {
                console.log(error.toString());
                return false
            }
        },

        asignarItemResponsable: async (_, { input }) => {
            const responsable = await Responsable.findOne({ci: input.ci})
            const item = await Item.findById(input.itemId)
            if (!responsable) {
                const responsableNuevo = new Responsable()
                responsableNuevo.nombre = input.nombre
                responsableNuevo.ci = input.ci
                responsableNuevo.telefono = input.telefono
                responsableNuevo.cargo = input.cargo
                const asignado = new Asignado()
                asignado.fecha = Date.now()
                asignado.responsableId = responsableNuevo.id
                asignado.itemId = item.id
                asignado.cantidad = input.cantidad
                asignado.retornado = false
                item.cantidad = item.cantidad - input.cantidad
                await responsableNuevo.save()
                await asignado.save()
                await item.save()
                return true
            } else {
                const asignado = new Asignado()
                asignado.fecha = Date.now()
                asignado.responsableId = responsable.id
                asignado.itemId = item.id
                asignado.cantidad = input.cantidad
                asignado.retornado = false
                item.cantidad = item.cantidad - input.cantidad
                await asignado.save()
                await item.cantidad
                return true
                
            }
        }
    }
}

module.exports = resolverResponsable