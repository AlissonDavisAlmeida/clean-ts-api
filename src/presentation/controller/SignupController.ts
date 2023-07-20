import { MissingParamError } from '../errors/MissingParamError';
import { type HttpRequest, type HttpResponse } from '../protocols/http';

export class SignupController {
  handle (httpRequest: HttpRequest): HttpResponse {
    if (!httpRequest.body.email) {
      return {
        statusCode: 400,
        body: new MissingParamError('email')
      };
    }

    if (!httpRequest.body.name) {
      return {
        statusCode: 400,
        body: new MissingParamError('name')
      };
    }

    return {
      statusCode: 200,
      body: 'ok'
    };
  }
}
