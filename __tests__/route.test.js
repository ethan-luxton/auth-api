'use strict';

const b64 = require('js-base64');
const { sequelize, AuthUser } = require('../src/models');
const { signin } = require('../src/auth/routes/index');


describe('Auth Routes', () => {
  it('returns a web token for a sign in route', async () => {
    // arrange
    await sequelize.sync();
    await AuthUser.createWithHashed('Ethan', 'pip1');

    // act
    const req = {
      header: jest.fn().mockImplementation((header) => {
        if (header === 'Authorization') {
          return 'Basic ' + b64.encode('Ethan:pip1');
        }
        return '';
      }),
    };
    const res = { send: jest.fn() };
    const next = jest.fn();
    await signin(req, res, next);

    // assert
    const token = res.send.mock.lastCall[0];
    const [_header, payloadBase64, _signature] = token.split('.');
    const payload = JSON.parse(b64.decode(payloadBase64));
    expect(payload.username).toBe('Ethan');
  });
});
