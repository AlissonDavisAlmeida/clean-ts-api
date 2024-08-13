import { type Authentication } from '@/@domain/useCases/account/authentication';
import { badRequest, ok, serverError, unauthorized } from '../../../helpers/httpHelper';
import { type Controller, type HttpRequest, type HttpResponse } from '../../../protocols';
import { type Validation } from '../../../protocols/validation';

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

      const authenticationResult = await this.authentication.auth({ email, password });

      if (!authenticationResult?.token) {
        return unauthorized();
      }

      return ok({
        token: authenticationResult.token,
        name: authenticationResult.name
      });
    } catch (error: any) {
      return serverError(error);
    }
  }
}
