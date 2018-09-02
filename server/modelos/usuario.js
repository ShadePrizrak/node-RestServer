//requireds
const mongoose = require('mongoose');
const uniqueVal = require('mongoose-unique-validator');

//variables
let Schema = mongoose.Schema;
let RolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} No es un rol válido'
}

//Definición de esquema

let UsuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, "El nombre es necesario"]
    },
    email: {
        type: String,
        required: [true, "El correo es necesario"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "La  contraseña es obligatoria"]
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: RolesValidos
    },
    estado: {
        default: true,
        type: Boolean

    },
    google: {
        type: Boolean,
        default: false
    }

});


//Eliminar la contraseña de la respuesta exitosa
UsuarioSchema.methods.toJSON = function() {
    let Aux = this;
    let AuxObjeto = Aux.toObject();
    delete AuxObjeto.password;

    return AuxObjeto;
}

UsuarioSchema.plugin(uniqueVal, {
    message: 'El {PATH} debe ser único'
});

module.exports = mongoose.model('Usuario', UsuarioSchema);