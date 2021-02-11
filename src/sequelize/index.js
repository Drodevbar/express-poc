const { Sequelize } = require('sequelize');
const config = require('../config');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: config.nodeEnv === 'test' ? 'db/database.test.sqlite' : 'db/database.sqlite',
  logQueryParameters: config.nodeEnv === 'dev',
  benchmark: config.nodeEnv === 'dev',
  logging: config.nodeEnv === 'test' ? false : console.log,
});

require('./model/todo')(sequelize);
require('./model/user')(sequelize);

require('./associations')(sequelize.models);

module.exports = sequelize;
