import { MissingParamError } from '../errors/MissingParamError';
import { badRequest } from '../helpers/httpHelper';
import { type HttpRequest, type HttpResponse } from '../protocols/http';

export class SignupController {
  handle (httpRequest: HttpRequest): HttpResponse | undefined {
    const requiredFields = ['email', 'name', 'password', 'passwordConfirmation'];

    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field));
      }
    }
  }
}
