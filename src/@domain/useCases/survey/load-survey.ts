import { type SurveyModel } from '@/@domain/models/SurveyModel';

export interface LoadSurveys {
  load: () => Promise<SurveyModel[]>
}
