import { type LoadAccountByToken } from '@/@domain/useCases/account/loadAccountByToken';
import { AccessDeniedError } from '../errors';
import { forbidden, ok } from '../helpers/httpHelper';
import { type HttpRequest, type HttpResponse } from '../protocols';
import { type Middleware } from '../protocols/middlewares';

export class AuthMiddleware implements Middleware {
  constructor (private readonly loadAccountByToken: LoadAccountByToken) { }

  private returnForbidden () {
    return forbidden(new AccessDeniedError());
  }

  handle = async (httpRequest: HttpRequest): Promise<HttpResponse> => {
    const accessToken = httpRequest.headers?.['x-access-token'];

    if (!accessToken) {
      return this.returnForbidden();
    }

    const account = await this.loadAccountByToken.load(accessToken);

    if (!account) {
      return this.returnForbidden();
    }

    return ok(account);
  };
}
