//requireds
const express = require('express');

//variables
const app = express();


app.use(require('./login'));
app.use(require('./usuario'));


module.exports = app;