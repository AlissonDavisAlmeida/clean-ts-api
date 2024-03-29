import { InvalidParamError, MissingParamError } from '../../errors';
import { badRequest, ok, serverError } from '../../helpers/httpHelper';
import {
  type EmailValidator,
  type Controller,
  type AddAccount,
  type HttpRequest,
  type HttpResponse
} from './signup.protocols';

export class SignupController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['email', 'name', 'password', 'passwordConfirmation'];

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }

      const { name, email, password, passwordConfirmation } = httpRequest.body;

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'));
      }

      const isValidEmail = this.emailValidator.isValid(email);

      if (!isValidEmail) {
        return badRequest(new InvalidParamError('email'));
      }

      const account = await this.addAccount.add({
        name,
        email,
        password
      });

      return ok(account);
    } catch (error: any) {
      return serverError(error);
    }
  }
}
