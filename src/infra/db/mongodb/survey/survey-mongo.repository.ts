import { type AddSurveyRepository } from '@/@data/protocols/db/survey/add-survey.repository';
import { mongoHelper } from '../helpers/mongo-helper';
import { type AddSurveyParams } from '@/@domain/useCases/survey/add-survey';
import { type LoadSurveysRepository } from '@/@data/protocols/db/survey/load-surveys.repository';
import { type SurveyModel } from '@/@domain/models/SurveyModel';

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository {
  async add (surveyData: AddSurveyParams): Promise<void> {
    const surveyCollection = await mongoHelper.getCollection('surveys');

    const result = await surveyCollection?.insertOne(surveyData);

    if (!result?.acknowledged) {
      throw new Error('Error on insert new survey');
    }

    const account = await surveyCollection?.findOne({ _id: result.insertedId });

    if (!account) {
      throw new Error('Error on find inserted survey');
    }

    // return mongoHelper.map<AddSurveyParams>(account);
  }

  async loadAll (): Promise<SurveyModel[]> {
    const surveyCollection = await mongoHelper.getCollection('surveys');

    const surveysWithID = await surveyCollection?.find().toArray();

    const surveys = surveysWithID?.map(survey => {
      return mongoHelper.map<SurveyModel>(survey);
    });

    if (!surveys) {
      return [];
    }

    return surveys;
  }
}
