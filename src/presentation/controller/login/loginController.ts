import { type Authentication } from '../../../domain/useCases/authentication';
import { InvalidParamError, MissingParamError } from '../../errors';
import { badRequest, ok, serverError, unauthorized } from '../../helpers/httpHelper';
import { type Controller, type HttpRequest, type HttpResponse } from '../../protocols';
import { type EmailValidator } from '../signup/signup.protocols';

export class LoginController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly authentication: Authentication
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const requiredFields = ['email', 'password'];

    try {
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }

      const { email, password } = httpRequest.body;

      const isValid = this.emailValidator.isValid(email);

      if (!isValid) {
        return badRequest(new InvalidParamError('email'));
      }

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
