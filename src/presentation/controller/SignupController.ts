import { InvalidParamError } from '../errors/InvalidParamError';
import { MissingParamError } from '../errors/MissingParamError';
import { ServerError } from '../errors/ServerError';
import { badRequest } from '../helpers/httpHelper';
import { type Controller } from '../protocols/controller';
import { type EmailValidator } from '../protocols/emailValidator';
import { type HttpRequest, type HttpResponse } from '../protocols/http';

export class SignupController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator
  ) {}

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
      return {
        statusCode: 500,
        body: new ServerError()
      };
    }
  }
}
