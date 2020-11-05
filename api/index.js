const express = require('express');
const bodyParser = require('body-parser');

const config = require('../config.js');
const auth = require('./components/auth/network');
const movie = require('./components/movie/network');

const errors = require('../network/errors');

const app = express();

app.use(bodyParser.json());

// ROUTER
app.use('/api/auth', auth);
app.use('/api/movie', movie);

// Errors
app.use(errors);

app.listen(config.api.port, () => {
  console.log('Api escuchando en el puerto ', config.api.port);
});
