
const Item = require('../../db/models/Item')
const TipoItem = require('../../db/models/TipoItem')
const Dependencia = require('../../db/models/Dependencia')
const Pertenece = require('../../db/models/Pertenece')

const resolverItem = {
    Query: {
        obtenerItems: async (_, { }) => {
            try {
                const items = await Item.find().sort({ nombre: 1 })
                return items;
            } catch (error) {
                console.log(error.toString())
                return null
            }
        },

        obtenerItemsPorNombre: async (_, { nombre }) => {
            try {
                const items = await Item.find({ nombre: { $regex: '.*' + nombre + '.*' } })
                    .sort({ nombre: 1 })
                return items
            } catch (error) {
                console.log(error.toString())
                return null
            }
        },

        obtenerItemPorId: async (_, { id }) => {
            try {
                const item = await Item.findById(id)
                return item
            } catch (error) {
                console.log(error.toString())
                return null
            }
        },

        obtenerTiposItem: async (_, { }) => {
            try {
                const tiposItem = await TipoItem.find().sort({ nombre: 1 })
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
        },

        obtenerDependenciaPorId: async  (_,{ id } ) => {
            try {
                const dependencia = await Dependencia.findById(id);
                return dependencia;
            }catch (err){
                console.log(err.toString());
                return null;
            }
        },

        obtenerPertenencias: async (_, { id }) => {
            const pertenencias = await Pertenece.find({dependencia: id}).sort({fecha: -1})
            return pertenencias;
        },

        obtenerItemsCantidad: async (_, {}) => {
            const items = await Item.find({cantidad: {$lte: 10}}).sort({cantidad: 1})
            return items
        }
    },

    Item: {
        tipo: async (parent) => {
            return await TipoItem.findById(parent.tipo)
        }
    },

    Pertenece: {
        item: async (parent) => {
            return await Item.findById(parent.item)
        },

        dependencia: async (parent) => {
            return await Dependencia.findById(parent.dependencia)
        }
    },

    Mutation: {
        agregarItem: async (_, { input }) => {
            const item = new Item()
            item.codigo = input.codigo
            item.nombre = input.nombre
            item.desc = input.desc
            item.fechaCompra = input.fechaCompra
            item.valor = input.valor
            item.ubicacion = input.ubicacion
            item.estado = input.estado == "Activo" ? true : false
            item.obs = input.obs
            item.tiempoVida = input.tiempoVida
            item.tipo = input.tipo
            item.cantidad = input.cantidad
            try {
                await item.save()
                return item
            } catch (error) {
                console.log(error.toString())
                return null
            }
        },

        agregarTipoItem: async (_, { nombre }) => {
            const tipo = await TipoItem.findOne({ nombre: nombre })
            if (!tipo) {
                try {
                    const tiposItem = new TipoItem()
                    tiposItem.nombre = nombre
                    tiposItem.save()
                    return tiposItem
                } catch (error) {
                    console.log(error.toString())
                }
            } else {
                return null
            }
        },

        eliminarTipoItem: async (_, { id }) => {
            const tipo = await TipoItem.findByIdAndDelete(id)
            if (tipo) {
                return tipo
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
                    return nuevaDependencia
                } catch (error) {
                    console.log(error.toString())
                    return null
                }
            }
            return null
        },

        editarDependencia:async (_, { id, input }) => {
            const dependencia = await Dependencia.findById(id)
            if(dependencia){
                dependencia.nombre = input.nombre
                dependencia.desc = input.desc
                await dependencia.save()
                return true
            }
            return false
        },

        eliminarDependecia: async (_, { id }) => {
            const dependenciaEliminar = await Dependencia.findByIdAndDelete(id)
            if (dependenciaEliminar){
                return dependenciaEliminar
            }
            return null
        },

        asignarPertenencia: async (_, { itemId, dependenciaId, cantidad }) => {
            try {
                const item = await Item.findById(itemId)
                const dependencia = await Dependencia.findById(dependenciaId)
                if (!item && !dependencia && (item.cantidad < cantidad)) {
                    return null
                }
                const pertenece = new Pertenece()
                pertenece.item = itemId
                pertenece.dependencia = dependenciaId
                pertenece.cantidad = cantidad
                item.cantidad = item.cantidad - cantidad
                await pertenece.save()
                await item.save()
                return pertenece
            } catch (error) {
                console.log(error.toString())
                return null
            }
        },

        retornoPertenencia: async (_, { pertenenciaId }) => {
            const pertenencia = await Pertenece.findById(pertenenciaId)
            //console.log(pertenencia)
            if (pertenencia){
                const item = await Item.findById(pertenencia.item)
                item.cantidad = item.cantidad + pertenencia.cantidad
                pertenencia.fecha_retorno = Date.now()
                pertenencia.retornado = true;
                await item.save()
                await pertenencia.save()
                return pertenencia
            }
            return null
        },

        agregarCantidadesItem: async (_, { itemId, cantidad }) => {
            const item = await Item.findById(itemId)
            item.cantidad += cantidad
            item.fechaCompra = Date.now()
            await item.save()
            return item
        }
    }
}

module.exports = resolverItem