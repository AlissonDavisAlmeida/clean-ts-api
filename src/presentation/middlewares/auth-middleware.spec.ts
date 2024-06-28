import { type LoadAccountByToken } from '@/@domain/useCases/account/loadAccountByToken';
import { AccessDeniedError } from '../errors';
import { forbidden } from '../helpers/httpHelper';
import { type HttpRequest } from '../protocols';
import { AuthMiddleware } from './auth-middleware';
import { type AccountModel } from '../controller/account/signup/signup.protocols';

interface SutTypes {
  sut: AuthMiddleware
  loadAccountByTokenStub: LoadAccountByToken
}

const makeLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    load = async (accessToken: string): Promise<AccountModel> => {
      return {
        id: 'any_id',
        name: 'any_name',
        email: 'any_email',
        password: 'any_password'
      };
    };
  }

  return new LoadAccountByTokenStub();
};

const makeSut = (): SutTypes => {
  const loadAccountByTokenStub = makeLoadAccountByToken();
  const sut = new AuthMiddleware(loadAccountByTokenStub);
  return {
    sut,
    loadAccountByTokenStub
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

  test('should call LoadAccountByToken with correct accessToken', async () => {
    const { sut, loadAccountByTokenStub } = makeSut();

    const loadAccountByTokenSpy = jest.spyOn(loadAccountByTokenStub, 'load');

    await sut.handle(fakeRequest);

    expect(loadAccountByTokenSpy).toHaveBeenCalledWith('any_token');
  });

  test('should return 403 if LoadAccountByToken returns null', async () => {
    const { sut, loadAccountByTokenStub } = makeSut();

    jest.spyOn(loadAccountByTokenStub, 'load').mockResolvedValueOnce(null);

    const httpResponse = await sut.handle({});

    expect(httpResponse).toStrictEqual(forbidden(new AccessDeniedError()));
  });
});
