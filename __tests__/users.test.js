'use strict';

const supertest = require('supertest');
const { server } = require('../src/server.js');
const { sequelize } = require('../src/models/index.js');
const request = supertest(server);



const createUser = async () => {
  return await request.post('/signup').send({
    username: 'testuser',
    password: 'testpass',
  });
};

describe('POST Users', () => {
  beforeEach(async () => {await sequelize.sync();});

  afterEach(async () => {await sequelize.drop();});
  test.skip('Tests posting to /signup route', async () => {
    const res = await createUser();
    expect(res.status).toBe(201);
  });

  test.skip('Tests posting to the /signin route', async () => {
    const res = await request
    .post('/signin')
    .set('Authorization', 'Basic dGVzdHVzZXI6dGVzdHBhc3M=');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ username: 'testuser' });
  });

  test.skip('Tests posting to the /signin route for bad request', async () => {
    const res = await request
    .post('/signin')
    .set('Authorization', 'Basic dGVzdHVzZXI6dGVzdHBhc3');
    expect(res.status).toBe(500);
  });
});