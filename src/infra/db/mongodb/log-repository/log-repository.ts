import { type LogErrorRepository } from '../../../../data/protocols/log-error-repository';
import { mongoHelper } from '../helpers/mongo-helper';

export class LogMongoRepository implements LogErrorRepository {
  async logError (stack: string): Promise<void> {
    const errorCollection = await mongoHelper.getCollection('errors');

    await errorCollection?.insertOne({
      stack,
      date: new Date()
    });
  }
}
