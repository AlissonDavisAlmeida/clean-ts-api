import { app } from '../config/app';
import request from 'supertest';

describe('Content-type Middleware', () => {
  test('should return default content type as json', async () => {
    const path = '/test_content_type_json';

    app.get(path, (_, res) => {
      res.send('');
    });

    await request(app)
      .get(path)
      .expect('content-type', /json/);
  });
  test('should return xml content type when forced', async () => {
    const path = '/test_content_type_xml';

    app.get(path, (_, res) => {
      res.type('xml');
      res.send('');
    });

    await request(app)
      .get(path)
      .expect('content-type', /xml/);
  });
});
