import { type HttpRequest, type HttpResponse } from '../protocols/http';

export class SignupController {
  handle (httpRequest: HttpRequest): HttpResponse {
    if (!httpRequest.body.email) {
      return {
        statusCode: 400,
        body: new Error('Missing param: email')
      };
    }

    if (!httpRequest.body.name) {
      return {
        statusCode: 400,
        body: new Error('Missing param: name')
      };
    }

    return {
      statusCode: 200,
      body: 'ok'
    };
  }
}
