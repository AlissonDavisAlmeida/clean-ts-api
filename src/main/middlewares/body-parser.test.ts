import request from 'supertest';
import { app } from '../config/app';

describe('Body Parser Middleware', () => {
  test('should parser body as json', async () => {
    const path = '/test_body_parser';
    const body = { name: 'any_name' };

    app.post(path, (req, res) => {
      res.send(req.body);
    });

    await request(app).post(path).send(body).expect(body);
  });
});
