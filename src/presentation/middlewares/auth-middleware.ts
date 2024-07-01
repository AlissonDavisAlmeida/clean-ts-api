import { type LoadAccountByToken } from '@/@domain/useCases/account/loadAccountByToken';
import { AccessDeniedError } from '../errors';
import { forbidden, ok, serverError } from '../helpers/httpHelper';
import { type HttpRequest, type HttpResponse } from '../protocols';
import { type Middleware } from '../protocols/middlewares';

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken,
    private readonly role?: string
  ) { }

  private returnForbidden () {
    return forbidden(new AccessDeniedError());
  }

  handle = async (httpRequest: HttpRequest): Promise<HttpResponse> => {
    const accessToken = httpRequest.headers?.['x-access-token'];

    if (!accessToken) {
      return this.returnForbidden();
    }
    try {
      const account = await this.loadAccountByToken.load(accessToken, this.role);

      if (!account) {
        return this.returnForbidden();
      }

      return ok({
        account_id: account.id
      });
    } catch (error: any) {
      return serverError(error);
    }
  };
}
