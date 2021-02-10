require('dotenv').config();

module.exports = {
  nodeEnv: process.env.NODE_ENV,
  port: process.env.PORT || 4000,
  jwtSecret: process.env.JWT_SECRET,
};
