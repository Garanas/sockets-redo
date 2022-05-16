
// - importing

const express = require('express');
const path = require('path');

// - functionality

const api = express();

api.use(express.static(path.join(__dirname, '..', 'shared')));
api.use(express.static(path.join(__dirname, '..', 'public')));
api.use('/*', express.static('index.html'));

// - exporting

module.exports = api;