const { sign } = require('jsonwebtoken');
const config = require('../../../src/config');

module.exports.secret = config.jwtSecret;

module.exports.generate = (email, expiresIn = '1 day') => sign({ email }, config.jwtSecret, { expiresIn });
