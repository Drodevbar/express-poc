const request = require('supertest');
const server = require('../../src/server');
const databaseHelper = require('./util/database-helper');

describe('authentication', () => {
  beforeEach(async () => {
    await databaseHelper.initialize();
  });

  afterEach(async () => {
    await databaseHelper.drop();
  });

  describe('POST /api/auth/token', () => {
    it('should return valid token and 201 status when new valid user created', async () => {
      const credentials = {
        email: 'foo@bar.com',
        password: 'secret',
      };

      const response = await request(server)
        .post('/api/auth/token')
        .send(credentials);

      expect(response.body.token).toEqual(expect.any(String));
      expect(response.status).toBe(201);
    });

    it('should return the same valid token and 200 status when valid credentials provided for existing user', async () => {
      const credentials = {
        email: 'foo@bar.com',
        password: 'secret',
      };
      const user = await databaseHelper.createNewUser(credentials);

      const response = await request(server)
        .post('/api/auth/token')
        .send(credentials);

      expect(response.body.token).toEqual(user.token);
      expect(response.status).toBe(200);
    });

    it('should return 401 when credentials do not match', async () => {
      const credentials = {
        email: 'foo@bar.com',
        password: 'secret',
      };
      await databaseHelper.createNewUser(credentials);

      const response = await request(server)
        .post('/api/auth/token')
        .send({
          email: credentials.email,
          password: 'wrong-password',
        });

      expect(response.status).toBe(401);
    });
  });
});
