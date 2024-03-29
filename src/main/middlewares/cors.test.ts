import { app } from '../config/app';
import request from 'supertest';

describe('Cors Middleware', () => {
  test('should enable cors', async () => {
    const path = '/test_cors';

    app.get(path, (_, res) => {
      res.send();
    });

    await request(app)
      .get(path)
      .expect('access-control-allow-origin', '*')
      .expect('access-control-allow-methods', '*')
      .expect('access-control-allow-headers', '*');
  });
});
