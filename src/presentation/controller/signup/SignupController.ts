import { InvalidParamError } from '../../errors';
import { badRequest, ok, serverError } from '../../helpers/httpHelper';
import {
  type Controller,
  type AddAccount,
  type HttpRequest,
  type HttpResponse,
  type Validation
} from './signup.protocols';

export class SignupController implements Controller {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validation: Validation
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

      return ok(account);
    } catch (error: any) {
      return serverError(error);
    }
  }
}
