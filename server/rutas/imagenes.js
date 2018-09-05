const fs = require('fs');
const express = require('express');
const path = require('path');
const { VerificarTokenIMG } = require('../middlewares/autenticacion')

//variables
const app = express();

//Servicios

app.get('/imagen/:tipo/:img', VerificarTokenIMG, (req, res) => {

    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);
    console.log(pathImg);
    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else {
        let NotFoundImagen = path.resolve(__dirname, '../assets/no-image.jpg');
        res.sendFile(NotFoundImagen);
    }


});

module.exports = app;