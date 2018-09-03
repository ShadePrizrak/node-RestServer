//========
// PUERTO
//========

process.env.PORT = process.env.PORT || 3001;

//========
// ENTORNO
//========

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//========
// Vencimiento del token
//========

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30


//========
// Seed de autenticación
//========
process.env.SEED = process.env.SEED || 'Este-es-el-seed-de-desarrollo'

//========
// BASE DE DATOS
//========

process.env.Mongo_URI = process.env.Mongo_URI || 'mongodb://localhost:27017/cafe';