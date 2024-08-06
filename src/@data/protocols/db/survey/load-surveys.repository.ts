import { type SurveyModel } from '@/@domain/models/SurveyModel';

export interface LoadSurveysRepository {
  loadAll: () => Promise<SurveyModel[]>
}
