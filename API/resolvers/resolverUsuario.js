
const Usuario = require('../../db/models/Usuario')
const bcrypt = require('bcrypt')
const { crearJWToken } = require('../../auth/authToken');
const Bitacora = require('../../db/models/Bitacora');

const resolverUsuario = {
    Query: {
        obtenerUsuarios: async (_, { }) => {
            const usuarios = await Usuario.find().populate('bitacoras')
            return usuarios
        },

        obtenerAccesos: async (_, { userId }) => {
            const usuario = await Usuario.findById(userId).populate('bitacoras')
            return usuario
        },

        obtenerBitacoras: async (_, { }) => {
            const bitacoras = await Bitacora.find().sort({fecha: -1})
            return bitacoras
        },

        obtenerBitacorasPorUsuario: async (_, { usuarioId }) => {
            const bitacoras = await Bitacora.find({ usuario: usuarioId })
            return bitacoras
        }
    },

    Bitacora: {
        usuario: async (parent) => {
            const usuario = await Usuario.findById(parent.usuario)
            return usuario
        }
    },

    /* Usuario: {
        bitacoras: async (parent) => {
            const bitacoras = await Bitacora.find({id: parent.bitacoras, usuario: parent.id})
            return bitacoras
        }
    }, */

    Mutation: {
        agregarUsuario: async (_, { input }) => {
            const num = 15;
            const pass = await bcrypt.hash(input.password, num)
            const usuarioExistente = await Usuario.findOne({ ci: input.ci })
            if (!usuarioExistente) {
                const usuario = new Usuario()
                usuario.nombre = input.nombre
                usuario.telefono = input.telefono
                usuario.ci = input.ci
                usuario.password = pass
                usuario.activo = true
                usuario.administrador = input.administrador
                try {
                    await usuario.save()
                    return usuario
                }
                catch (error) {
                    console.log(error.toString())
                    return null
                }
            } else {
                console.log('Usuario existente')
                return null
            }
        },

        loguearUsuario: async (_, { input }) => {
            const usuario = await Usuario.findOne({ ci: input.ci })
            const passCorrecto = await bcrypt.compare(input.password, usuario.password)
            if (usuario.activo){
                if (usuario && passCorrecto) {
                    const token = crearJWToken({
                        id: usuario.id,
                        nombre: usuario.nombre,
                        telefono: usuario.telefono,
                        ci: usuario.ci,
                        administrador: usuario.administrador,
                        activo: usuario.activo
                    })
                    const bitacora = new Bitacora()
                    bitacora.fecha = Date.now()
                    bitacora.usuario = usuario.id
                    usuario.bitacoras.push(bitacora.id)
                    await bitacora.save()
                    await usuario.save()
                    return token
                } else {
                    return null
                }
            } else {
                return null
            }
        },

        editarUsuario: async (_, { input }) => {
            const num = 15
            const usuario = await Usuario.findOne({ ci: input.ci })
            if (usuario) {
                if(input.password != null){
                    let passwordNuevo = await bcrypt(input.password, num)
                    usuario.nombre = input.nombre
                    usuario.telefono = input.telefono
                    usuario.ci = input.ci
                    usuario.password = passwordNuevo
                    usuario.administrador = input.administrador
                    await usuario.save()
                    return usuario
                } else {
                    usuario.nombre = input.nombre
                    usuario.telefono = input.telefono
                    usuario.ci = input.ci
                    usuario.administrador = input.administrador
                    await usuario.save()
                    return usuario
                }
            } else {
                return null
            }
        },

        eliminarUsuario: async (_, { id }) => {
            const user = await Usuario.findById(id);
            if (user) {
                try {
                    await Usuario.findByIdAndRemove(user.id)
                    await Bitacora.deleteMany({ usuarioId: id })
                    return true
                }
                catch (error) {
                    console.log(error.toString())
                    return false
                }
            } else {
                return null
            }
        }
    }
}

module.exports = resolverUsuario