//requireds
const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const { VerificarToken, VerificarAdminRole } = require('../middlewares/autenticacion');

//Variables
const app = express();
const Usuario = require('../modelos/usuario');

app.get('/usuario', VerificarToken, function(req, res) {

    let desde = req.query.desde || 0
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite)

    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde) //Salta cierta cantidad de registros
        .limit(limite) //Limite de registros que muestra desde el salto
        .exec((err, usuarios) => {
            if (err) {
                return res
                    .status(400)
                    .json({
                        ok: false,
                        err
                    })
            };

            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    conteo
                });
            });


        });
});

app.post('/usuario', [VerificarToken, VerificarAdminRole], function(req, res) {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res
                .status(400)
                .json({
                    ok: false,
                    err
                })
        }
        // usuarioDB.password = null;


        res.json({
            ok: true,
            usuario: usuarioDB
        })
    });

});

app.put('/usuario/:id', [VerificarToken, VerificarAdminRole], function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        };

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });

});

app.delete('/usuario/:id', [VerificarToken, VerificarAdminRole], function(req, res) {
    let id = req.params.id;

    Usuario.findByIdAndUpdate(id, { estado: false }, { new: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });


    // Usuario.findByIdAndRemove(id, (err, usuario) => {
    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         })
    //     };

    //     if (!usuario) {
    //         return res.status(400).json({
    //             ok: false,
    //             err: {
    //                 message: "Usuario no encotrado"
    //             }
    //         })
    //     }

    //     res.json({
    //         ok: true,
    //         usuario
    //     });
    // });
});

module.exports = app;