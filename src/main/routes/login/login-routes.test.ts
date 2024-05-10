import request from 'supertest';
import { app } from '../../config/app';
import { mongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';

describe('Login routes', () => {
  beforeAll(async () => {
    await mongoHelper.connect(process.env.MONGO_URL ?? '');
  });

  afterAll(async () => {
    await mongoHelper.disconnect();
  });

  beforeEach(async () => {
    const accountCollection = await mongoHelper.getCollection('accounts');
    await accountCollection?.deleteMany({});
  });
  describe('POST /signup', () => {
    test('should return 200 on signup', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'any_name',
          email: 'any_email@gmail.com',
          password: 'any_password',
          passwordConfirmation: 'any_password'
        })
        .expect(200);
    });
  });

  describe('Login routes', () => {

  });
});
