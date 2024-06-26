import { type Collection } from 'mongodb';
import { mongoHelper } from '../helpers/mongo-helper';
import { LogMongoRepository } from './log-mongo.repository';

interface SutTypes {
  sut: LogMongoRepository
}

const makeSut = (): SutTypes => {
  const sut = new LogMongoRepository();

  return {
    sut
  };
};

describe('Log Mongo Repository', () => {
  let errorCollection: Collection | undefined;

  beforeAll(async () => {
    await mongoHelper.connect(process.env.MONGO_URL ?? '');
  });

  afterAll(async () => {
    await mongoHelper.disconnect();
  });

  beforeEach(async () => {
    errorCollection = await mongoHelper.getCollection('errors');
    await errorCollection?.deleteMany({});
  });

  test('should create an error log on success', async () => {
    const { sut } = makeSut();
    await sut.logError('any_error');

    const count = await errorCollection?.countDocuments();

    expect(count).toBe(1);
  });
});
