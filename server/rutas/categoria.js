//Requireds
const express = require('express');
const { VerificarToken, VerificarAdminRole } = require('../middlewares/autenticacion');
const _ = require('underscore');


//Variables

let app = express();
const Categoria = require('../modelos/categoria');


//==============================================================
//SERVICIOS
//==============================================================

//Muestra todas la categorias
app.get('/categoria', VerificarToken, (req, res) => {
    Categoria.find({}, 'descripcion usuario')
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categoria) => {
            if (err) {
                return res
                    .status(400)
                    .json({
                        ok: false,
                        err
                    });
            };

            Categoria.count({}, (err, conteo) => {
                res.json({
                    ok: true,
                    categoria,
                    conteo
                });
            });
        });
});

//Muestra una categoria según un ID
app.get('/categoria/:id', VerificarToken, (req, res) => {
    let id = req.params.id;
    console.log(id);
    Categoria.findById(id, 'descripcion usuario', (err, categoria) => {
        if (err) {
            return res
                .status(500)
                .json({
                    ok: false,
                    err
                });
        };

        res.json({
            ok: true,
            categoria
        });
    });
});

//Crea una nueva caterogia
app.post('/categoria', VerificarToken, (req, res) => {
    //Crear una nueva catergoría
    //req.usuario._id
    let id = req.usuario._id;

    categoria = new Categoria({
        descripcion: req.body.descripcion, //Mandamos en el body una desscripción para la categoría
        usuario: id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res
                .status(500)
                .json({
                    ok: false,
                    err
                });
        };
        res.json({
            ok: true,
            categoriaDB
        });
    });
});

//Actualiza una categoría
app.put('/categoria/:id', VerificarToken, (req, res) => {
    let id = req.params.id;
    let categoriaActualizada = {
        descripcion: req.body.descripcion
    }
    Categoria.findByIdAndUpdate(id, categoriaActualizada, { new: true, runValidators: true, context: 'query' }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});
// app.put('/categoria/:id', VerificarToken, (req, res) => {

//     let id = req.params.id;
//     let body = req.body;

//     let descCategoria = {
//         descripcion: body.descripcion
//     };

//     Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {

//         if (err) {
//             return res.status(500).json({
//                 ok: false,
//                 err
//             });
//         }

//         if (!categoriaDB) {
//             return res.status(400).json({
//                 ok: false,
//                 err
//             });
//         }

//         res.json({
//             ok: true,
//             categoria: categoriaDB
//         });

//     });
// });

//Elimina un categoría
app.delete('/categoria/:id', [VerificarToken, VerificarAdminRole], (req, res) => {
    //Crear una nueva catergoría
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, body, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        };
        res.json({
            ok: true,
            categoriaDB
        })
    });

});

module.exports = app;