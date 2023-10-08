const jwt = require('jsonwebtoken')

const crearJWToken = usuario => jwt.sign({ usuario }, 'CEAArmonia', {
    expiresIn: 900, //15 min de expiración del token
})

module.exports = { crearJWToken }