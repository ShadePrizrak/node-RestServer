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

process.env.CADUCIDAD_TOKEN = process.env.CADUCIDAD_TOKEN || '48h'


//========
// Seed de autenticación
//========
process.env.SEED = process.env.SEED || 'Este-es-el-seed-de-desarrollo'

//========
// BASE DE DATOS
//========

process.env.Mongo_URI = process.env.Mongo_URI || 'mongodb://localhost:27017/cafe';

//========
// GOOGLE CLIENT ID
//========
process.env.CLIENT_ID = process.env.CLIENT_ID || "809781065973-3meh6uahpl0k3f8ehhegmo2mb7340080.apps.googleusercontent.com";