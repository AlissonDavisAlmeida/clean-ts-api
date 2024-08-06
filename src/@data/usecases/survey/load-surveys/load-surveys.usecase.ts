import { type LoadSurveysRepository } from '@/@data/protocols/db/survey/load-surveys.repository';
import { type SurveyModel } from '@/@domain/models/SurveyModel';
import { type LoadSurveys } from '@/@domain/useCases/survey/load-survey';

export class LoadSurveysUseCase implements LoadSurveys {
  constructor (private readonly loadSurveysRepository: LoadSurveysRepository) {}

  load = async (): Promise<SurveyModel[]> => {
    const surveys = await this.loadSurveysRepository.loadAll();

    return surveys;
  };
}
