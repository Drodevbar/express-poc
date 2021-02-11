const request = require('supertest');
const todo = require('../../src/sequelize/dao/todo');
const server = require('../../src/server');
const databaseHelper = require('./util/database-helper');

const userCredentials = { email: 'foo@bar.com', password: 'secret' };

describe('authentication', () => {
  let user;
  let todos;
  let authToken;

  beforeEach(async () => {
    await databaseHelper.initialize();

    user = await databaseHelper.createNewUser(userCredentials);
    todos = await databaseHelper.createTodos([
      { title: '#1' },
      { title: '#2' },
      { title: '#3' },
    ], user);
    authToken = { Authorization: user.token };
  });

  afterEach(async () => {
    await databaseHelper.drop();
  });

  describe('GET /api/todo', () => {
    it('should return list of todos and status 200', async () => {
      const response = await request(server)
        .get('/api/todo')
        .set(authToken)
        .send();

      expect(response.body).toHaveLength(todos.length);
      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/todo/:id', () => {
    it('should return todo for given id and status 200 if todo found', async () => {
      const todoId = todos[0].id;
      const response = await request(server)
        .get(`/api/todo/${todoId}`)
        .set(authToken)
        .send();

      expect(response.body).toMatchObject({
        id: todoId,
        title: '#1',
      });
      expect(response.status).toBe(200);
    });

    it('should return 404 status for not existing todo', async () => {
      const todoId = 123;
      const response = await request(server)
        .get(`/api/todo/${todoId}`)
        .set(authToken)
        .send();

      expect(response.status).toBe(404);
    });

    it('should return 404 status when todo does not belong to logged in user', async () => {
      const otherUser = await databaseHelper.createNewUser({ email: 'intruder@foo.bar', password: '123' });
      const otherUserAuthToken = { Authorization: otherUser.token };

      const todoId = todos[0].id;
      const response = await request(server)
        .get(`/api/todo/${todoId}`)
        .set(otherUserAuthToken)
        .send();

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/todo', () => {
    it('should create new todo', async () => {
      const newTodo = { title: 'New todo!' };
      const response = await request(server)
        .post('/api/todo')
        .set(authToken)
        .send(newTodo);

      const apiResponseBody = response.body;
      const savedTodo = await databaseHelper.fetchTodo(apiResponseBody.id);

      expect(apiResponseBody).toMatchObject(newTodo);
      expect(response.status).toBe(201);
      expect(savedTodo).toMatchObject(newTodo);
    });

    it('should return status 400 status when title property is missing', async () => {
      const newTodo = { };
      const response = await request(server)
        .post('/api/todo')
        .set(authToken)
        .send(newTodo);

      expect(response.status).toBe(400);
    });
  });

  describe('PATCH /api/todo/:id', () => {
    it('should update existing todo', async () => {
      const todoId = todos[0].id;
      const requestParams = { title: 'Updated title!', isCompleted: true };
      const response = await request(server)
        .patch(`/api/todo/${todoId}`)
        .set(authToken)
        .send(requestParams);

      const apiResponseBody = response.body;
      const savedTodo = await databaseHelper.fetchTodo(apiResponseBody.id);

      expect(apiResponseBody).toMatchObject(requestParams);
      expect(response.status).toBe(200);
      expect(savedTodo).toMatchObject(requestParams);
    });

    it('should return 400 status when new title is too short', async () => {
      const todoId = todos[0].id;
      const requestParams = { title: 'a', isCompleted: true };
      const response = await request(server)
        .patch(`/api/todo/${todoId}`)
        .set(authToken)
        .send(requestParams);

      expect(response.status).toBe(400);
    });

    it('should return 404 status when todo not found', async () => {
      const todoId = 123;
      const requestParams = { title: 'Updated title!', isCompleted: true };
      const response = await request(server)
        .patch(`/api/todo/${todoId}`)
        .set(authToken)
        .send(requestParams);

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/todo/:id', () => {
    it('should delete specified todo (set isDeleted flag to true) and return 204 status', async () => {
      const todoId = todos[0].id;
      const response = await request(server)
        .delete(`/api/todo/${todoId}`)
        .set(authToken)
        .send();

      expect(response.body).toStrictEqual({});
      expect(response.status).toBe(204);

      const getRequest = await request(server)
        .get(`/api/todo/${todoId}`)
        .set(authToken)
        .send();
      
      expect(getRequest.status).toBe(404);

      const savedTodo = await databaseHelper.fetchTodo(todoId);
      expect(savedTodo.isDeleted).toBe(true);
    });

    it('should return 404 status when specified todo does not exist', async () => {
      const todoId = 123;
      const response = await request(server)
        .delete(`/api/todo/${todoId}`)
        .set(authToken)
        .send();

      expect(response.status).toBe(404);
    });
  });
});
