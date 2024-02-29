import { InvalidParamError, MissingParamError } from '../../errors';
import { badRequest, ok, serverError } from '../../helpers/httpHelper';
import { type Controller, type HttpRequest, type HttpResponse } from '../../protocols';
import { type EmailValidator } from '../signup/signup.protocols';

export class LoginController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator
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

      return ok({});
    } catch (error: any) {
      return serverError(error);
    }
  }
}
