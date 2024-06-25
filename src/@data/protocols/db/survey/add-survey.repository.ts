import { type SurveyModel } from '@/@domain/models/SurveyModel';

export interface AddSurveyRepository {
  add: (data: SurveyModel) => Promise<void>
}
