import { type Document, type Collection } from 'mongodb';
import { mongoHelper } from '../helpers/mongo-helper';
import { AccountMongoRepository } from './account-mongo.repository';

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
  test('should return null if email not found', async () => {
    const sut = makeSut();

    const account = await sut.loadByEmail('any_email@gmail.com');

    expect(account).toBeNull();
  });

  test('should update the account accessToken on updateAccessToken success', async () => {
    const sut = makeSut();

    const result = await accountCollection?.insertOne({
      name: 'any_name',
      email: 'any_email@gmail.com',
      password: 'any_password'
    });

    const accessToken = 'any_token';
    const id = result?.insertedId;

    await sut.updateAccessToken({
      accessToken,
      id
    });

    const account = await accountCollection?.findOne({ _id: result?.insertedId });

    expect(account).toBeTruthy();
    expect(account?.accessToken).toBe(accessToken);
  });

  test('should return an account on loadByToken without role', async () => {
    const sut = makeSut();

    await accountCollection?.insertOne({
      name: 'any_name',
      email: 'any_mail@.com',
      password: 'any_password',
      accessToken: 'any_token'
    });

    const account = await sut.loadByToken('any_token');

    expect(account).toBeTruthy();
    expect(account?.id).toBeTruthy();
  });

  test('should return an account on loadByToken with role', async () => {
    const sut = makeSut();

    await accountCollection?.insertOne({
      name: 'any_name',
      email: 'any_mail@.com',
      password: 'any_password',
      accessToken: 'any_token',
      role: 'any_role'
    });

    const account = await sut.loadByToken('any_token', 'any_role');

    expect(account).toBeTruthy();
    expect(account?.id).toBeTruthy();
  });
});
