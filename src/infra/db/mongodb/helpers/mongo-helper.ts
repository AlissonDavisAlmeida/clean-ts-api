import { MongoClient, type WithId } from 'mongodb';

export const mongoHelper = {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  client: {} as MongoClient,
  async connect (uri: string): Promise<void> {
    this.client = await MongoClient.connect(uri);
  },
  async disconnect (): Promise<void> {
    await this.client.close();
  },

  getCollection (name: string) {
    return this.client.db().collection(name);
  },

  map<T>(collection: WithId<any>): T {
    const { _id, ...collectionWithoutId } = collection;
    return Object.assign({}, collectionWithoutId, { id: _id });
  }
};
