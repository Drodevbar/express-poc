const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const { Todo } = require('../../sequelize').models;
const todoResponseModel = require('./response-model/todo');

router.use(require('../../middleware/auth'));

router.get('/', async (req, res) => {
  const { user } = req;
  const todos = await Todo.findAll({
    where: {
      isDeleted: false,
      userId: user.id,
    },
  }).catch(() => []);

  return res.status(200).json(todos.map((todo) => todoResponseModel(todo)));
});

router.get('/:id', async (req, res) => {
  const { user } = req;
  const { id } = req.params;
  const todo = await Todo.findOne({
    where: {
      id,
      isDeleted: false,
      userId: user.id,
    },
  });

  if (todo === null) {
    return res.status(404).json({
      message: `Todo not found for given id ${id}`,
    });
  }

  return res.status(200).json(todoResponseModel(todo));
});

router.post(
  '/',
  body('title').isLength({ min: 3, max: 300 }),
  async (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res.status(400).json({ errors: validationErrors.array() });
    }

    const { title } = req.body;
    const newTodo = Todo.build({
      title,
      userId: req.user.id,
    });

    try {
      await newTodo.save();
    } catch (err) {
      res.status(400).json({
        message: 'Error during creating new Todo element',
        errors: err.errors,
      });
    }

    return res.status(201).json(todoResponseModel(newTodo));
  },
);

router.patch(
  '/:id',
  body('isCompleted').isBoolean().optional(),
  body('title').isLength({ min: 3, max: 300 }).optional(),
  async (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res.status(400).json({ errors: validationErrors.array() });
    }

    const { id } = req.params;
    const todo = await Todo.findOne({
      where: {
        id,
        isDeleted: false,
        userId: req.user.id,
      },
    });

    if (todo === null) {
      return res.status(404).json({
        message: `Todo not found for given id ${id}`,
      });
    }

    const { title, isCompleted } = req.body;

    if (title !== undefined) {
      todo.title = title;
    }
    if (isCompleted !== undefined) {
      todo.isCompleted = isCompleted;
    }

    await todo.save();

    return res.status(200).json(todoResponseModel(todo));
  },
);

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const todo = await Todo.findOne({
    where: {
      id,
      isDeleted: false,
      userId: req.user.id,
    },
  });

  if (todo === null) {
    return res.status(404).json({
      message: `Todo not found for given id ${id}`,
    });
  }

  todo.isDeleted = true;
  await todo.save();

  return res.status(204).json({});
});

module.exports = router;
