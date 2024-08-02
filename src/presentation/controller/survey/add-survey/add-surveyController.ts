import { type AddSurvey } from '@/@domain/useCases/survey/add-survey';
import { type Validation, type Controller, type HttpRequest, type HttpResponse } from '@/presentation/controller/account/signup/signup.protocols';
import { badRequest, noContent, serverError } from '@/presentation/helpers/httpHelper';

export class AddSurveyController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly addSurvey: AddSurvey
  ) { }

  handle = async (httpRequest: HttpRequest): Promise<HttpResponse> => {
    const { question, answers } = httpRequest.body;

    try {
      const date = new Date();
      const error = this.validation.validate({ question, answers, date });

      if (error) {
        return badRequest(error);
      }
      await this.addSurvey.add({ question, answers, date });

      return noContent();
    } catch (error: any) {
      return serverError(error);
    }
  };
}
