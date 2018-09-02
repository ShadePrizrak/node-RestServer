//requireds
require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

//Variables
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//Importamos rutas del usuario
app.use(require('./rutas/usuario'));

mongoose.connect(process.env.URLDB, (error, resp) => {
    if (error) throw error;

    console.log('Base de datos ONLINE');
});


//Configuración del puerto
app.listen(process.env.PORT, () => {
    let date = new Date();
    console.log(`Escuchando desde el puerto:${process.env.PORT}. Ultima actualización ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`);
});