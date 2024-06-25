import { type AddSurveyRepository } from '@/@data/protocols/db/survey/add-survey.repository';
import { type AddSurvey, type AddSurveyParams } from '@/@domain/useCases/survey/add-survey';

export class AddSurveyUseCase implements AddSurvey {
  constructor (
    private readonly addSurveyRepository: AddSurveyRepository
  ) {}

  add = async (data: AddSurveyParams): Promise<void> => {
    await this.addSurveyRepository.add(data);
  };
}
