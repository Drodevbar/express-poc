const { Sequelize } = require('sequelize');
const config = require('../config');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'db/database.sqlite',
  logQueryParameters: config.nodeEnv === 'dev',
  benchmark: config.nodeEnv === 'dev',
});

require('./dao/todo')(sequelize);
require('./dao/user')(sequelize);

require('./associations.js')(sequelize.models);

module.exports = sequelize;
