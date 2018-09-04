//Requireds
const express = require('express');
const { VerificarToken } = require('../middlewares/autenticacion');
const _ = require('underscore');


//Variables
let app = express();
let Producto = require('../modelos/producto');

//================
//SERVICIOS
//================

//Muestra todos los productos
app.get('/producto', VerificarToken, (req, res) => {
    let desde = req.query.desde || 0
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({})
        .skip(desde)
        .limit(limite)
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, ProductoDB) => {
            if (err) {
                return res
                    .status(400)
                    .json({
                        ok: false,
                        err
                    });
            };
            Producto.count({}, (err, conteo) => {
                res.json({
                    ok: true,
                    ProductoDB,
                    conteo
                });
            });
        });
});

//Muetra un producto según el ID
app.get('/producto/:id', VerificarToken, (req, res) => {
    let id = req.params.id;

    Producto.findById(id, 'descripcion usuario', (err, ProductoDB) => {
            if (err) {
                return res
                    .status(400)
                    .json({
                        ok: false,
                        err
                    });
            };

            res.json({
                ok: true,
                ProductoDB
            });
        })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion');
});

//Buscar productos
app.get('/producto/buscar/:termino', VerificarToken, (req, res) => {
    let termino = req.params.termino;

    //Expresion regular
    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('usuario', 'nombre email')
        .exec((err, ProductoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                ProductoDB
            })
        });
});


//Inserta un nuevo producto
app.post('/producto', VerificarToken, (req, res) => {
    //Variables necesarias 
    let body = req.body;

    let NuevoProducto = new Producto({
        nombre: body.nombre,
        precioUni: body.precio,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id,
        disponible: req.disponible
    });

    NuevoProducto.save((err, ProductoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            ProductoDB
        })
    });
});

//Actualiza un producto
app.put('/producto/:id', VerificarToken, (req, res) => {

    let id = req.params.id;
    let NuevoProducto = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'disponible', 'categoria']);

    Producto.findByIdAndUpdate(id, NuevoProducto, { new: true, runValidators: true }, (err, ProductoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (!ProductoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        res.json({
            ok: true,
            ProductoDB
        });
    });
});
//Elimina un producto
app.delete('/producto/:id', VerificarToken, (req, res) => {
    let id = req.params.id;

    Producto.findByIdAndUpdate(id, { disponible: false }, { new: true, runValidators: true }, (err, ProductoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (!ProductoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        res.json({
            ok: true,
            ProductoDB
        });
    });
});
module.exports = app;