const jwt = require('jsonwebtoken');


//=======================
//Verificar token
//=======================

let VerificarToken = (req, res, next) => {
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decode) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        req.usuario = decode.usuario;
        next();

    })
};

//=======================
//Verificar ADMIN ROL
//=======================

let VerificarAdminRole = (req, res, next) => {
    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.json({
            ok: false,
            err: {
                message: 'Usted no es usuario Administrador'
            }
        });
    }
}

//=============================
//Verificar token para imagenes
//=============================

let VerificarTokenIMG = (req, res, next) => {
    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decode) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        req.usuario = decode.usuario;
        next();

    })
};

module.exports = {
    VerificarToken,
    VerificarAdminRole,
    VerificarTokenIMG
}