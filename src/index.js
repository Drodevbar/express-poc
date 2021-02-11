const config = require('./config');
const sequelize = require('./sequelize');
const server = require('./server');

const startServer = async () => {
  try {
    await sequelize.sync();
    console.log('Database connected');

    server.listen(config.port, () => {
      console.log(`Server listening at port ${config.port}`);
    });
  } catch (err) {
    console.log('Error connecting to the database', err.message);
    process.exit(1);
  }
};

startServer();
