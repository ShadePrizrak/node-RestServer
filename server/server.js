//requireds
require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

//Variables
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//Habilitar carpeta public
app.use(express.static(path.resolve(__dirname, '../public')))

//Configuración global de rutas
app.use(require('./rutas/index'));

mongoose.connect(process.env.Mongo_URI, (error, resp) => {
    if (error) throw error;

    console.log('Base de datos ONLINE');
});


//Configuración del puerto
app.listen(process.env.PORT, () => {
    let date = new Date();
    console.log(`Escuchando desde el puerto:${process.env.PORT}. Ultima actualización ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`);
});