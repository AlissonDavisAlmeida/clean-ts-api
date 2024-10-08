import request from 'supertest';
import { app } from '../../config/app';
import { mongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';
import { type Collection, type Document } from 'mongodb';
import { type AddSurveyParams } from '@/@domain/useCases/survey/add-survey';
import jwt from 'jsonwebtoken';
import { config } from '@/main/config/env';

const fakeSurveyData = (): Omit<AddSurveyParams, 'date'> => ({
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer'
    }
  ]
});
describe('Survey routes', () => {
  let surveyCollection: Collection<Document> | undefined;
  let accountCollection: Collection<Document> | undefined;
  beforeAll(async () => {
    await mongoHelper.connect(process.env.MONGO_URL ?? '');
  });

  afterAll(async () => {
    await mongoHelper.disconnect();
  });

  beforeEach(async () => {
    surveyCollection = await mongoHelper.getCollection('surveys');
    await surveyCollection?.deleteMany({});
    accountCollection = await mongoHelper.getCollection('accounts');
    await accountCollection?.deleteMany({});
  });
  describe('POST /surveys', () => {
    test('should return 403 on add survey withou access-token', async () => {
      await request(app)
        .post('/api/surveys')
        .send(fakeSurveyData())
        .expect(403);
    });

    test('should return 204 on add survey with valid access-token', async () => {
      const res = await accountCollection?.insertOne({
        name: 'any_name',
        email: 'any_mail@com.com',
        password: 'any_password',
        role: 'admin'
      });

      const id = res?.insertedId;
      const accessToken = jwt.sign({ id }, config.jwtSecret);

      await accountCollection?.updateOne(
        { _id: id },
        {
          $set: {
            accessToken
          }
        }
      );

      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send(fakeSurveyData())
        .expect(204);
    });
  });

  describe('GET /surveys', () => {
    test('should return 403 on load surveys without access-token', async () => {
      await request(app).get('/api/surveys').expect(403);
    });

    test('should return 204 on load surveys with valid access-token and empty list', async () => {
      const res = await accountCollection?.insertOne({
        name: 'any_name',
        email: 'any_mail@com.com',
        password: 'any_password',
        role: 'admin'
      });

      const id = res?.insertedId;
      const accessToken = jwt.sign({ id }, config.jwtSecret);

      await accountCollection?.updateOne(
        { _id: id },
        {
          $set: {
            accessToken
          }
        }
      );

      await request(app)
        .get('/api/surveys')
        .set('x-access-token', accessToken)
        .expect(204);
    });
    test('should return 200 on load surveys with valid access-token', async () => {
      const res = await accountCollection?.insertOne({
        name: 'any_name',
        email: 'any_mail@com.com',
        password: 'any_password',
        role: ''
      });

      const id = res?.insertedId;
      const accessToken = jwt.sign({ id }, config.jwtSecret);

      await accountCollection?.updateOne(
        { _id: id },
        {
          $set: {
            accessToken
          }
        }
      );

      await surveyCollection?.insertOne(fakeSurveyData());

      await request(app)
        .get('/api/surveys')
        .set('x-access-token', accessToken)
        .expect(200);
    });
  });
});
