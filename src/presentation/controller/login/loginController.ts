import { type Authentication } from '../../../domain/useCases/authentication';
import { badRequest, ok, serverError, unauthorized } from '../../helpers/httpHelper';
import { type Controller, type HttpRequest, type HttpResponse } from '../../protocols';
import { type Validation } from '../signup/signup.protocols';

export class LoginController implements Controller {
  constructor (
    private readonly authentication: Authentication,
    private readonly validation: Validation
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body);

      if (error) {
        return badRequest(error);
      }

      const { email, password } = httpRequest.body;

      const accessToken = await this.authentication.auth({ email, password });

      if (!accessToken) {
        return unauthorized();
      }

      return ok({
        accessToken
      });
    } catch (error: any) {
      return serverError(error);
    }
  }
}
