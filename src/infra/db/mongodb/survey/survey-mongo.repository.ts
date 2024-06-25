import { type AddSurveyRepository } from '@/@data/protocols/db/survey/add-survey.repository';
import { mongoHelper } from '../helpers/mongo-helper';
import { type AddSurveyParams } from '@/@domain/useCases/survey/add-survey';

export class SurveyMongoRepository implements AddSurveyRepository {
  async add (surveyData: AddSurveyParams): Promise<void> {
    const surveyCollection = await mongoHelper.getCollection('surveys');

    const result = await surveyCollection?.insertOne(surveyData);

    if (!result?.acknowledged) {
      throw new Error('Error on insert new account');
    }

    const account = await surveyCollection?.findOne({ _id: result.insertedId });

    if (!account) {
      throw new Error('Error on find inserted account');
    }

    // return mongoHelper.map<AddSurveyParams>(account);
  }
}
