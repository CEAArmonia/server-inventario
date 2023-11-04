const jwt = require('jsonwebtoken')

const crearJWToken = usuario => jwt.sign({ usuario }, 'CEAArmonia', {
    expiresIn: 600, //15 min de expiración del token
})

module.exports = { crearJWToken }