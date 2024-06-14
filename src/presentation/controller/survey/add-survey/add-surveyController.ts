import { type Validation, type Controller, type HttpRequest, type HttpResponse } from '@/presentation/controller/account/signup/signup.protocols';
import { badRequest } from '@/presentation/helpers/httpHelper';

export class AddSurveyController implements Controller {
  constructor (
    private readonly validation: Validation
  ) { }

  handle = async (httpRequest: HttpRequest): Promise<HttpResponse> => {
    const { question, answers } = httpRequest.body;
    const error = this.validation.validate({ question, answers });

    if (error) {
      return badRequest(error);
    }

    return {
      statusCode: 200,
      body: {}
    };
  };
}
