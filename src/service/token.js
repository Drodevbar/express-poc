const { TokenExpiredError, sign, verify } = require('jsonwebtoken');
const config = require('../config');
const { tokenStatus } = require('../enum/token-status');

const generate = (email, expiresIn = '1 day') => sign(
  { email },
  config.jwtSecret,
  { expiresIn },
);

const getTokenDetails = (token) => {
  try {
    const payload = verify(token, config.jwtSecret);

    return {
      status: tokenStatus.VALID,
      payload,
    };
  } catch (err) {
    return err instanceof TokenExpiredError
      ? { status: tokenStatus.EXPIRED, payload: {} }
      : { status: tokenStatus.INVALID, payload: {} };
  }
};

module.exports.tokenService = {
  generate,
  getTokenDetails,
};
