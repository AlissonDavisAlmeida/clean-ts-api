import request from 'supertest';
import { app } from '../../config/app';
import { mongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';
import { type Collection, type Document } from 'mongodb';
import bcrypt from 'bcrypt';
describe('Login routes', () => {
  let accountCollection: Collection<Document> | undefined;
  beforeAll(async () => {
    await mongoHelper.connect(process.env.MONGO_URL ?? '');
  });

  afterAll(async () => {
    await mongoHelper.disconnect();
  });

  beforeEach(async () => {
    accountCollection = await mongoHelper.getCollection('accounts');
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

  describe('POST /login', () => {
    test('should return 200 on login', async () => {
      const passwordHash = await bcrypt.hash('any_password', 12);
      await accountCollection?.insertOne({
        name: 'any_name',
        email: 'any_mail@mail.com',
        password: passwordHash
      });
      await request(app)
        .post('/api/login')
        .send({
          email: 'any_mail@mail.com',
          password: 'any_password'
        })
        .expect(200);
    });
    test('should return 401 on login fails', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'any_mail@mail.com',
          password: 'any_password'
        })
        .expect(401);
    });
  });
});
