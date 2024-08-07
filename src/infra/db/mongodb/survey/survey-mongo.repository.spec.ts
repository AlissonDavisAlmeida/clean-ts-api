import { type Document, type Collection } from 'mongodb';
import { mongoHelper } from '../helpers/mongo-helper';
import { SurveyMongoRepository } from './survey-mongo.repository';
import { type AddSurveyParams } from '@/@domain/useCases/survey/add-survey';

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository();
};

const fakeSurveyData = (): AddSurveyParams => ({
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer'
    }
  ],
  date: new Date()
});

const fakeSurveysData = (): AddSurveyParams[] => [
  {
    question: 'any_question',
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer'
      }
    ],
    date: new Date()
  },
  {
    question: 'other_question',
    answers: [
      {
        image: 'other_image',
        answer: 'other_answer'
      }
    ],
    date: new Date()
  }

];

describe('SurveyMongoDBRepository', () => {
  let surveyCollection: Collection<Document> | undefined;
  beforeAll(async () => {
    await mongoHelper.connect(process.env.MONGO_URL ?? '');
  });

  afterAll(async () => {
    await mongoHelper.disconnect();
  });

  beforeEach(async () => {
    surveyCollection = await mongoHelper.getCollection('surveys');
    await surveyCollection?.deleteMany({});
  });

  describe('add()', () => {
    test('should add survey in database', async () => {
      const sut = makeSut();

      const data = fakeSurveyData();

      await sut.add(data);

      const survey = await surveyCollection?.findOne({ question: data.question });

      expect(survey).toBeTruthy();
      expect(survey?.question).toBe(data.question);
      expect(survey?.answers).toEqual(data.answers);
    });
  });

  describe('loadAll()', () => {
    test('should load all surveys in database', async () => {
      const sut = makeSut();

      const data = fakeSurveysData();

      await surveyCollection?.insertMany(data);

      const surveys = await sut.loadAll();

      expect(surveys.length).toBe(2);
      expect(surveys[0].question).toBe(data[0].question);
      expect(surveys[1].question).toBe(data[1].question);
    });

    test('should load empty list if there are no surveys in database', async () => {
      const sut = makeSut();

      const surveys = await sut.loadAll();

      expect(surveys.length).toBe(0);
    });
  });
});
