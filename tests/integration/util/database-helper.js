const bcrypt = require('bcryptjs');
const sequelize = require('../../../src/sequelize');
const jwtHelper = require('./jwt-helper');

module.exports.initialize = async () => {
  try {
    await sequelize.sync();
  } catch (err) {
    console.log('Error during initializing database', err.message);
    process.exit(1);
  }
};

module.exports.drop = async () => {
  try {
    await sequelize.drop();
  } catch (err) {
    console.log('Error during clearing database', err.message);
    process.exit(1);
  }
};

module.exports.createNewUser = async ({ email, password }) => {
  const user = sequelize.models.User.build({
    email,
    token: jwtHelper.generate(email),
    passwordHash: bcrypt.hashSync(password),
  });
  await user.save();

  return user;
};

module.exports.createTodos = async (todos, user) => {
  const promises = todos.map((todo) => {
    const model = sequelize.models.Todo.build({
      ...todo, userId: user.id
    });

    return model.save();
  });

  await Promise.all(promises);

  return await sequelize.models.Todo.findAll();
};

module.exports.fetchTodo = async (id) => sequelize.models.Todo.findByPk(id);
