
const express = require('express');
const { conectarDB } = require('./db');


const app = express();
require('dotenv').config();
const port = process.env.PORT || 3000;
module.exports = app;

async function start() { 
    conectarDB();
    app.get('/', (req, res) => {
        res.send('Hola desde un servidor express)');
    })

    app.listen(port, () => console.log('>> Servidor ejecutandose en: ' + port))
}

start()