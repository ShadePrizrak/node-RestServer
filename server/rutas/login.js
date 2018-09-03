//requireds
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');




//Modelos de BD
const Usuario = require('../modelos/usuario');
//Variables
const app = express();
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

//Metodo POST para logear
app.post('/login', (req, res) => {
    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuario) => {
        if (err) {
            return res.status(500).json({
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

//Configuraciones de google
//Esta funcion verifica que el token sea valido
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    console.log(payload.name);
    console.log(payload.email);
    console.log(payload.picture);

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }

};

app.post('/google', async(req, res) => {
    let token = req.body.idtoken;
    let googleUser;
    try {
        googleUser = await verify(token)
    } catch (err) {}
    res.status(403).json({
        ok: false,
        err: {
            message: 'El token es invalido'
        }
    });

    Usuario.findOne({ email: googleUser.email }, (err, UsuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        };

        if (UsuarioDB) {
            if (UsuarioDB.google === false) {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err: {
                            message: 'Debe utilizar su autenticación Usuario/Contraseña'
                        }
                    });
                };
            } else {
                let token = jwt.sign({ UsuarioDB }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });
                return res.json({
                    ok: true,
                    usuario: UsuarioDB,
                    token
                });
            }
        } else {
            //Si el usuario no existe en nuestra base de datos
            let usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save((err, UsuarioDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                };
                let token = jwt.sign({ usuario }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });
                return res.json({
                    ok: true,
                    usuario: UsuarioDB,
                    token
                });
            });
        };
    });

    // res.json({
    //     usuario: googleUser
    // })
});


//Exportamos las configuraciones
module.exports = app;