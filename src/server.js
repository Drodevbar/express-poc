const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const server = express();

server.use(cors());
server.use(bodyParser.json());

server.use('/api/auth', require('./routes/api/authentication'));
server.use('/api/todo', require('./routes/api/todo'));

module.exports = server;
