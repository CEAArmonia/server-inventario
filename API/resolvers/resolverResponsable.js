
const Responsable = require('../../db/models/Responsable')
const Item = require('../../db/models/Item')
const Asignado = require('../../db/models/Asignado')

const resolverResponsable = {
    Query: {
        obtenerResponsables: async (_, { }) => {
            const responsables = await Responsable.find()
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

        asignarItemResponsable: async (_, { responsableId, itemId }) => {
            const responsable = await Responsable.findById(responsableId)
            const item = await Item.findById(itemId)
            if (!responsable && !item) {
                return null
            } else {
                try {
                    const asignado = new Asignado()
                    asignado.fecha = Date.now()
                    asignado.responsableId = responsableId
                    asignado.itemId = itemId
                    await asignado.save()
                    return true
                } catch (error) {
                    console.log(error.toString())
                    return false
                }
            }
        }
    }
}

module.exports = resolverResponsable