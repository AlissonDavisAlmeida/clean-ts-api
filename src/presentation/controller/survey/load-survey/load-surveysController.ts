import { type LoadSurveys } from '@/@domain/useCases/survey/load-survey';
import { noContent, ok, serverError } from '@/presentation/helpers/httpHelper';
import { type HttpRequest, type HttpResponse, type Controller } from '@/presentation/protocols';

export class LoadSurveysController implements Controller {
  constructor (private readonly loadSurveys: LoadSurveys) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurveys.load();
      if (surveys.length === 0) {
        return noContent();
      }
      return ok(surveys);
    } catch (error: any) {
      return serverError(error);
    }
  }
}
