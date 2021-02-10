module.exports = (models) => {
  models.User.hasMany(models.Todo, {
    foreignKey: {
      name: 'userId',
      allowNull: false,
    },
  });
  models.Todo.belongsTo(models.User, {
    foreignKey: 'userId',
  });
};
