import { mongoHelper } from '../helpers/mongo-helper';
import { AccountMongoRepository } from './account';

const makeSut = () => {
  return new AccountMongoRepository();
};

describe('Account MongoDBRepository', () => {
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

  test('should return an account on success', async () => {
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
});
