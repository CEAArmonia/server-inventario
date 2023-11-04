const { default: mongoose } = require("mongoose");

const conectarDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://ceavillaarmonia9:CEAvillaarmonia2023@ceadb.qbbze11.mongodb.net/inventory')
        console.log('>> Conectado con MongoDB <<')
    } catch (error) {
        console.log('Error de conexión a Mongo')
        console.log(error.toString())
        process.exit(1)
    }
}

module.exports = { conectarDB }