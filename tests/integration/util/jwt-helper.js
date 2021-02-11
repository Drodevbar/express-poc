const config = require('../../../src/config');
const { sign } = require('jsonwebtoken');

const JWT_SECRET = 'secret';

module.exports.secret = config.jwtSecret;

module.exports.generate = (email, expiresIn = '1 day') => sign({ email }, config.jwtSecret, { expiresIn });
