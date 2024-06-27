import { AccessDeniedError } from '../errors';
import { forbidden } from '../helpers/httpHelper';
import { type HttpRequest, type HttpResponse } from '../protocols';
import { type Middleware } from '../protocols/middlewares';

export class AuthMiddleware implements Middleware {
  handle = async (httpRequest: HttpRequest): Promise<HttpResponse> => {
    return forbidden(new AccessDeniedError());
  };
}
