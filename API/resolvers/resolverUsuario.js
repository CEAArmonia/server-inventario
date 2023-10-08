
const Usuario = require('../../db/models/Usuario')
const bcrypt = require('bcrypt')
const { crearJWToken } = require('../../auth/authToken');
const Bitacora = require('../../db/models/Bitacora');

const resolverUsuario = {
    Query: {
        obtenerUsuarios: async (_, { }) => {
            const usuarios = await Usuario.find()
            return usuarios
        },

        obtenerAccesos: async (_, { userId }) => {
            const usuario = await Usuario.findById(userId).populate('bitacoras')
            return usuario
        }
    },

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
                try {
                    await usuario.save()
                    return true
                }
                catch (error) {
                    console.log(error.toString())
                    return false
                }
            } else {
                console.log('Usuario existente')
                return null
            }
        },

        loguearUsuario: async (_, { input }) => {
            const usuario = await Usuario.findOne({ ci: input.ci })
            const passCorrecto = await bcrypt.compare(input.password, usuario.password)
            if (usuario && passCorrecto) {
                const token = crearJWToken({
                    id: usuario.id,
                    nombre: usuario.nombre,
                    telefono: usuario.telefono,
                    ci: usuario.ci
                })
                const bitacora = new Bitacora()
                bitacora.fecha = Date.now()
                bitacora.usuarioId = usuario.id
                usuario.bitacoras.push(bitacora.id)
                await bitacora.save()
                await usuario.save()
                return token
            } else {
                return null
            }
        },

        editarUsuario: async (_, { input }) => {
            const num = 15
            const usuario = await Usuario.findOne({ ci: input.ci })
            let passwordNuevo = await bcrypt(input.password, num)
            if (usuario) {
                try {
                    usuario.nombre = input.nombre
                    usuario.telefono = input.telefono
                    usuario.ci = input.ci
                    usuario.password = passwordNuevo
                    await usuario.save()
                    return true
                } catch (error) {
                    console.log(error.toString())
                    return false
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