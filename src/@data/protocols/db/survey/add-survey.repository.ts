import { type AddSurveyParams } from '@/@domain/useCases/survey/add-survey';

export interface AddSurveyRepository {
  add: (data: AddSurveyParams) => Promise<void>
}
