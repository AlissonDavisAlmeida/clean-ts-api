import { MongoClient, type WithId } from 'mongodb';

export const mongoHelper = {
  client: null as MongoClient | null,
  uri: '',
  async connect (uri: string): Promise<void> {
    this.uri = uri;
    this.client = await MongoClient.connect(uri);
  },

  async disconnect (): Promise<void> {
    await this.client?.close();
    this.client = null as any;
  },

  async getCollection (name: string) {
    if (!this.client) {
      console.log('Connecting to MongoDB');
      await this.connect(this.uri);
    }
    return this.client?.db().collection(name);
  },

  map<T>(collection: WithId<any>): T {
    const { _id, ...collectionWithoutId } = collection;
    return Object.assign({}, collectionWithoutId, { id: _id });
  }
};
