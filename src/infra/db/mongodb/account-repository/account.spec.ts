import { type Document, type Collection } from 'mongodb';
import { mongoHelper } from '../helpers/mongo-helper';
import { AccountMongoRepository } from './account';

const makeSut = () => {
  return new AccountMongoRepository();
};

describe('Account MongoDBRepository', () => {
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

  test('should return an account on add success', async () => {
    const sut = makeSut();

    const account = await sut.add({
      name: 'any_name',
      email: 'any_email@gmail.com',
      password: 'any_password'
    });

    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account.name).toBe('any_name');
    expect(account.email).toBe('any_email@gmail.com');
    expect(account.password).toBe('any_password');
  });
  test('should return an account on loadByEmail success', async () => {
    const sut = makeSut();

    await accountCollection?.insertOne({
      name: 'any_name',
      email: 'any_email@gmail.com',
      password: 'any_password'
    });

    const account = await sut.loadByEmail('any_email@gmail.com');

    expect(account).toBeTruthy();
    expect(account?.id).toBeTruthy();
    expect(account?.name).toBe('any_name');
    expect(account?.email).toBe('any_email@gmail.com');
    expect(account?.password).toBe('any_password');
  });
});
