import { AccessDeniedError } from '../errors';
import { forbidden } from '../helpers/httpHelper';
import { type HttpRequest } from '../protocols';
import { AuthMiddleware } from './auth-middleware';

interface SutTypes {
  sut: AuthMiddleware
}

const makeSut = (): SutTypes => {
  const sut = new AuthMiddleware();
  return {
    sut
  };
};

const fakeRequest: HttpRequest = {
  headers: {
    'x-access-token': 'any_token'
  }
};

describe('AuthMiddleware', () => {
  test('should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({});

    expect(httpResponse).toStrictEqual(forbidden(new AccessDeniedError()));
  });
});
