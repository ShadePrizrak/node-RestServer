//Requireds
const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');

//Variables

const Usuario = require('../modelos/usuario');
const Producto = require('../modelos/producto');
const app = express();

//Invocación del midleware
app.use(fileUpload());

app.put('/carga/:tipo/:id', (req, res) => {
    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningún archivo'
            }
        });
    };

    //Valida tipo
    let tiposValidos = ['productos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {
        res.status(400).json({
            ok: false,
            message: ' Los tipos permitidos para actualizar son ' + tiposValidos.join(', '),
            ext: tipo
        })
    }

    //Obteneción de la extension
    let Archivo = req.files.archivo;
    let NombreCortado = Archivo.name.split('.');
    let extensionRecibida = NombreCortado[NombreCortado.length - 1];

    //Extensiones permitidas
    let Extensiones = ['png', 'jpg', 'gif', 'jpeg'];

    if (Extensiones.indexOf(extensionRecibida) < 0) {
        res.status(400).json({
            ok: false,
            message: ' Las extensiones permitidas son ' + Extensiones.join(', '),
            ext: extensionRecibida
        })
    }

    //Cambiar el nombre al archivo unico
    let nombreArchivo = `${id}-${Math.random().toString(36).substr(2, 9)}-${new Date().getMilliseconds()}.${extensionRecibida}`

    Archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        //
        switch (tipo) {
            case 'usuarios':
                ImagenUsuario(id, res, nombreArchivo);
                break;
            case 'productos':
                ImagenProducto(id, res, nombreArchivo);
                break;
            default:
                BorrarArchivo(nombreArchivo, tipo);
        }
    });

});

const ImagenUsuario = (id, res, nombreArchivo) => {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            BorrarArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (!usuarioDB) {
            BorrarArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe en la base de datos.'
                }
            });
        };

        BorrarArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err, usuarioGuardado) => {
            if (err) {
                BorrarArchivo(usuarioDB.img, 'usuarios');
                return res.status(500).json({
                    ok: false,
                    err
                });
            };
            res.json({
                ok: true,
                usuarioGuardado,
                img: nombreArchivo
            });
        });
    });
};

const ImagenProducto = (id, res, nombreArchivo) => {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            BorrarArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (!productoDB) {
            BorrarArchivo(nombreArchivo, 'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe en la base de datos.'
                }
            });
        };

        BorrarArchivo(productoDB.img, 'usuarios');

        productoDB.img = nombreArchivo;
        productoDB.save((err, productoGuardado) => {
            if (err) {
                BorrarArchivo(productoDB.img, 'usuarios');
                return res.status(500).json({
                    ok: false,
                    err
                });
            };
            res.json({
                ok: true,
                productoGuardado,
                img: nombreArchivo
            });
        });
    });
}

const BorrarArchivo = (nombreImagen, tipo) => {
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);

    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;