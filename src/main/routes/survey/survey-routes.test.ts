import request from 'supertest';
import { app } from '../../config/app';
import { mongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';
import { type Collection, type Document } from 'mongodb';
import { type AddSurveyParams } from '@/@domain/useCases/survey/add-survey';

const fakeSurveyData = (): AddSurveyParams => ({
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer'
    }
  ]
});
describe('Survey routes', () => {
  let accountCollection: Collection<Document> | undefined;
  beforeAll(async () => {
    await mongoHelper.connect(process.env.MONGO_URL ?? '');
  });

  afterAll(async () => {
    await mongoHelper.disconnect();
  });

  beforeEach(async () => {
    accountCollection = await mongoHelper.getCollection('surveys');
    await accountCollection?.deleteMany({});
  });
  describe('POST /surveys', () => {
    test('should return 204 on add survey', async () => {
      await request(app)
        .post('/api/surveys')
        .send(fakeSurveyData())
        .expect(204);
    });
  });
});
