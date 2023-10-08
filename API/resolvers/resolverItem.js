
const Item = require('../../db/models/Item')
const TipoItem = require('../../db/models/TipoItem')
const Dependencia = require('../../db/models/Dependencia')
const Pertenece = require('../../db/models/Pertenece')

const resolverItem = {
    Query: {
        obtenerItems: async (_, { }) => {
            try {
                const items = await Item.find()
                return items;
            } catch (error) {
                console.log(error.toString())
                return null
            }
        },

        obtenerTiposItem: async (_, { }) => {
            try {
                const tiposItem = await TipoItem.find()
                return tiposItem
            } catch (error) {
                console.log(error.toString())
                return null
            }
        },

        obtenerMantenimientos: async (_, { id }) => {
            try {
                const item = await Item.findById(id)
                return item.mantenimientos
            } catch (error) {
                console.log(error.toString)
                return null
            }
        },

        obtenerItemsPorEstado: async (_, { estado }) => {
            if (estado != null && estado != '') {
                try {
                    const items = await Item.find({ estado: estado })
                    return items
                } catch (error) {
                    console.log(error.toString())
                    return null
                }
            }
        },

        obtenerDependencias: async (_, { nombre }) => {
            const dependencias = await Dependencia.find(
                { nombre: { $regex: '.*' + nombre + '.*' } })
                .sort({ nombre: 1 })
            return dependencias
        }
    },

    Mutation: {
        agregarItem: async (_, { input }) => {
            const item = new Item({ input })
            try {
                await item.save()
                return true
            } catch (error) {
                console.log(error.toString())
                return false
            }
        },

        agregarTipoItem: async (_, { nombre }) => {
            try {
                const tiposItem = await new TipoItem(nombre)
                tiposItem.save()
                return true
            } catch (error) {
                console.log(error.toString())
                return false
            }
        },

        editarItem: async (_, { id, input }) => {
            const item = await Item.findById(id)
            if (item) {
                try {
                    item.codigo = input.codigo
                    item.nombre = input.nombre
                    item.desc = input.desc
                    item.fechaCompra = input.fechaCompra
                    item.valor = input.valor
                    item.ubicacion = input.ubicacion
                    item.estado = input.estado
                    item.observaciones = input.observaciones
                    item.tiempoVida = input.tiempoVida
                    item.tipo = input.tipo
                    await item.save()
                    return true
                } catch (error) {
                    console.log(error.toString())
                    return false
                }
            } else {
                return null
            }
        },

        agregarMantenimiento: async (_, { id, fecha }) => {
            const item = await Item.findById(id)
            if (item) {
                try {
                    item.mantenimientos.push(fecha)
                    await item.save()
                    return true
                } catch (error) {
                    console.log(error.toString())
                    return false
                }
            } else {
                return null
            }
        },

        eliminarMantenimientos: async (_, { id }) => {
            try {
                const item = await Item.findByIdAndUpdate(id, { mantenimientos: [] })
                if (item) {
                    return item
                }
                return null
            } catch (error) {
                console.log(error.toString())
                return false
            }
        },

        editarMantenimientos: async (_, { id, fecha }) => {
            const item = await Item.findById(id)
            if (item) {
                try {
                    item.mantenimientos.push(fecha)
                    await item.save()
                    return true
                } catch (error) {
                    console.log(error.toString())
                    return false
                }
            }
            return null
        },

        agregarDependencias: async (_, { input }) => {
            const dependencia = await Dependencia.findOne({ nombre: input.nombre })
            if (!dependencia) {
                try {
                    const nuevaDependencia = new Dependencia(input)
                    await nuevaDependencia.save()
                    return true
                } catch (error) {
                    console.log(error.toString())
                    return false
                }
            }
            return null
        },

        asignarPertenencia: async (_, { idItem, idDependencia }) => {
            try {
                const item = await Item.findById(idItem)
                const dependencia = await Dependencia.findById(idDependencia)
                if (!item) {
                    return 'No-Item'
                }
                if (!dependencia) {
                    return 'No-Dependencia'
                }
                const pertenece = new Pertenece({ idItem, idDependencia })
                await pertenece.save()
                return 'ok'
            } catch (error) {
                console.log(error.toString())
                return 'error'
            }

        }
    }
}

module.exports = resolverItem