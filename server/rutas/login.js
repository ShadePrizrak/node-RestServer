//requireds
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

//Modelos de BD
const Usuario = require('../modelos/usuario');
//Variables
const app = express();

//Metodo POST para logear
app.post('/login', (req, res) => {
    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuario) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        };

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña incorrectos'
                }
            });
        }

        if (!bcrypt.compareSync(body.password, usuario.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña incorrectos'
                }
            });
        }

        let token = jwt.sign({ usuario }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({
            ok: true,
            usuario,
            token
        });

    });

});


//Exportamos las configuraciones
module.exports = app;