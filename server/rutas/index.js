//requireds
const express = require('express');

//variables
const app = express();


app.use(require('./login'));
app.use(require('./usuario'));
app.use(require('./categoria'));
app.use(require('./producto'));


module.exports = app;