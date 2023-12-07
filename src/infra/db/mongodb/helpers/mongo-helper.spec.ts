import { mongoHelper as sut } from './mongo-helper';

describe('Mongo Helper', () => {
  beforeAll(async () => {
    await sut.connect(process.env.MONGO_URL as string);
  });

  afterAll(async () => {
    await sut.disconnect();
  });

  test('should reconnect if mongodb is down', async () => {
    let accountsCollections = await sut.getCollection('accounts');
    expect(accountsCollections).toBeTruthy();

    await sut.disconnect();

    accountsCollections = await sut.getCollection('accounts');
    expect(accountsCollections).toBeTruthy();
  });
});
