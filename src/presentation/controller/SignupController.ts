import { InvalidParamError, MissingParamError } from '../errors';
import { badRequest, serverError } from '../helpers/httpHelper';
import { type Controller, type EmailValidator, type HttpRequest, type HttpResponse } from '../protocols';

export class SignupController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator
  ) { }

  handle (httpRequest: HttpRequest): HttpResponse | undefined {
    try {
      const requiredFields = ['email', 'name', 'password', 'passwordConfirmation'];

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }

      const isValidEmail = this.emailValidator.isValid(httpRequest.body.email);

      if (!isValidEmail) {
        return badRequest(new InvalidParamError('email'));
      }
    } catch (error) {
      return serverError();
    }
  }
}
