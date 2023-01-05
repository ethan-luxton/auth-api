const { server } = require('../src/server.js');
const supertest = require('supertest');
const { sequelize, AuthUser } = require('../src/models/index.js');
const { sign } = require('jsonwebtoken');
const request = supertest(server);
const { signin } = require('../src/auth/routes/index');
const b64 = require('js-base64');


beforeEach(async () => {await sequelize.sync()});


const createUser = async () => {
  return await request.post('/signup').send({
    username: 'testuser',
    password: 'testpass',
    role: 'admin'
  });


};

const signUserIn = async () => {
  await sequelize.sync();
    await AuthUser.createWithHashed('Ethan', 'pip1', 'admin');

    // act
    const req = {
      header: jest.fn().mockImplementation((header) => {
        if (header === 'Authorization') {
          return 'Basic ' + b64.encode('Ethan:pip1:admin');
        }
        return '';
      }),
    };
    const res = { send: jest.fn() };
    const next = jest.fn();
    await signin(req, res, next);

    // assert
    const token = res.send.mock.lastCall[0];
    return token.toString()
}

const createItems = async (jwt) => {
  await request.post('/clothes').set('Authorization', `Bearer ${jwt}`).send({   
      name:'jeans',
      group: 'pants',
  });
  await request.post('/clothes').set('Authorization', `Bearer ${jwt}`).send({
      name:'sweatshirt',
      group: 'top',
  });
}

describe('RESTful API', () => {
  
  test('Create an item', async () => {
    await createUser()
    const token = await signUserIn()
    let res = await request.post('/clothes').set('Authorization', `Bearer ${token}`).send({   
        name:'jeans',
        group: 'pants',
    });
    expect(res.body.name).toEqual('jeans');
    expect(res.body.group).toEqual('pants');
  });

  test('Find all items', async () => {
    
    
    await createUser()
    const token = await signUserIn()
    await createItems(token)
    let res = await request.get('/clothes').set('Authorization', `Bearer ${token}`);
    expect(res.body[0].name).toEqual('jeans');
    expect(res.body[0].group).toEqual('pants');
    expect(res.body[1].name).toEqual('sweatshirt');
    expect(res.body[1].group).toEqual('top');
  });

  test('Find one item', async () => {
    await createUser()
    const token = await signUserIn()
    await createItems(token)
    let res = await request.get('/clothes/2').set('Authorization', `Bearer ${token}`);
    expect(res.body.name).toEqual('sweatshirt');
    expect(res.body.group).toEqual('top');
  });

  test('Updates a single clothes item', async () => {
    await createUser()
    const token = await signUserIn()
    await createItems(token)
    await request.put('/clothes/1').set('Authorization', `Bearer ${token}`).send({
        name: "boots",
        group: 'shoes',
    });
    let res = await request.get('/clothes/1').set('Authorization', `Bearer ${token}`);
    expect(res.body.name).toEqual('boots');
    expect(res.body.group).toEqual('shoes');
  });

  test('Deletes a single clothes item', async () => {
    await createUser()
    const token = await signUserIn()
    await createItems(token)
    await request.delete('/clothes/1').set('Authorization', `Bearer ${token}`);
    let res = await request.get('/clothes').set('Authorization', `Bearer ${token}`);
    expect(res.body[0].name).toEqual('sweatshirt');
    expect(res.body[0].group).toEqual('top');
  });
});

afterEach(async () => {await sequelize.drop();});