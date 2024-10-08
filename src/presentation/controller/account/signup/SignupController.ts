import { AccountAlreadyExistsError } from '@/presentation/errors';
import { accountAlreadyExists, badRequest, ok, serverError } from '@/presentation/helpers/httpHelper';
import {
  type Controller,
  type AddAccount,
  type HttpRequest,
  type HttpResponse,
  type Validation,
  type Authentication
} from './signup.protocols';

export class SignupController implements Controller {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body);

      if (error) {
        return badRequest(error);
      }

      const { name, email, password } = httpRequest.body;

      const account = await this.addAccount.add({
        name,
        email,
        password
      });

      const authenticationResult = await this.authentication.auth({ email: account.email, password: account.password });

      return ok(authenticationResult);
    } catch (error: any) {
      if (error instanceof AccountAlreadyExistsError) {
        return accountAlreadyExists(error);
      }
      return serverError(error);
    }
  }
}
