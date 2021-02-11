const { Sequelize } = require('sequelize');
const config = require('../config');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: config.nodeEnv === 'test' ? 'db/database.test.sqlite' : 'db/database.sqlite',
  logQueryParameters: config.nodeEnv === 'dev',
  benchmark: config.nodeEnv === 'dev',
  logging: config.nodeEnv === 'test' ? false : console.log,
});

require('./dao/todo')(sequelize);
require('./dao/user')(sequelize);

require('./associations.js')(sequelize.models);

module.exports = sequelize;
