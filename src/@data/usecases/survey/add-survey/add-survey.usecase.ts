import { type AddSurvey, type AddSurveyParams } from '@/@domain/useCases/survey/add-survey';

export class AddSurveyUseCase implements AddSurvey {
  add = async (data: AddSurveyParams): Promise<void> => {};
}
