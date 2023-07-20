import { MissingParamError } from '../errors/MissingParamError';
import { badRequest } from '../helpers/httpHelper';
import { type HttpRequest, type HttpResponse } from '../protocols/http';

export class SignupController {
  handle (httpRequest: HttpRequest): HttpResponse {
    if (!httpRequest.body.email) {
      return badRequest(new MissingParamError('email'));
    }

    if (!httpRequest.body.name) {
      return badRequest(new MissingParamError('name'));
    }

    return {
      statusCode: 200,
      body: 'ok'
    };
  }
}
