const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('./config');
const sequelize = require('./sequelize');

const server = express();

server.use(cors());
server.use(bodyParser.json());

server.use('/api/auth', require('./routes/api/authentication'));
server.use('/api/todo', require('./routes/api/todo'));

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
