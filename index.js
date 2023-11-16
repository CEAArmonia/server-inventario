
const fs = require('fs')

//Schemas graphql
const pathSchemaUsuario = ('./API/schemas/schemaUsuario.graphql')
const pathSchemaItem = ('./API/schemas/schemaItem.graphql')
const pathSchemaResponsable = ('./API/schemas/schemaResponsable.graphql')

//Resolvers graphql
const resolverUsuario = require('./API/resolvers/resolverUsuario')
const resolverItem = require('./API/resolvers/resolverItem')
const resolverResponsable = require('./API/resolvers/resolverResponsable')

const express = require('express');
const { conectarDB } = require('./db');
const { ApolloServer, gql } = require('apollo-server-express')
const mongoose = require('mongoose')
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3000;
module.exports = app;

async function start() {
    conectarDB();
    const server = new ApolloServer({
        cache: 'bounded',
        persistedQueries: false,
        typeDefs: [
            gql(fs.readFileSync(pathSchemaUsuario, 'utf-8')),
            gql(fs.readFileSync(pathSchemaItem, 'utf-8')),
            gql(fs.readFileSync(pathSchemaResponsable, 'utf-8'))
        ],
        resolvers: [
            resolverUsuario,
            resolverItem,
            resolverResponsable
        ],
        playground: true,
        introspection: true
    })

    await server.start();
    server.applyMiddleware({ app })

    app.get('/', (req, res) => {
        res.send('Hola desde un servidor express)');
    })

    app.listen(port, () => console.log('>> Servidor ejecutandose en: ' + port))
}

start()