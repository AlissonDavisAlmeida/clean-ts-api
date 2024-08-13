import { type AuthenticationResult, type Authentication, type AuthenticationParams } from '@/@domain/useCases/account/authentication';
import { MissingParamError } from '@/presentation/errors';
import { badRequest, ok, serverError, unauthorized } from '@/presentation/helpers/httpHelper';
import { type Validation, type HttpRequest } from '@/presentation/protocols';
import { LoginController } from './loginController';

interface SutTypes {
  sut: LoginController
  authenticationStub: Authentication
  validationStub: Validation
}

const httpRequest: HttpRequest = {
  body: {
    email: 'any_email@mail.com',
    password: 'any_password'
  }
};

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authentication: AuthenticationParams): Promise<AuthenticationResult> {
      return {
        token: 'any_token',
        name: 'any_name'
      };
    }
  }

  return new AuthenticationStub();
};

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'valid@mail.com',
    password: 'any_password'
  }
});

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error | null {
      return null;
    }
  }

  return new ValidationStub();
};

const makeSut = (): SutTypes => {
  const authenticationStub = makeAuthentication();
  const validationStub = makeValidation();
  const sut = new LoginController(authenticationStub, validationStub);
  return {
    sut,
    authenticationStub,
    validationStub
  };
};

describe('Login Controller', () => {
  test('should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut();

    const authSpy = jest.spyOn(authenticationStub, 'auth');

    await sut.handle(httpRequest);

    expect(authSpy).toHaveBeenCalledWith({
      email: httpRequest.body?.email,
      password: httpRequest.body?.password
    });
  });
  test('should returns 401 if invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut();

    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise(resolve => { resolve({ token: '', name: '' }); }));

    const httpResult = await sut.handle(httpRequest);

    expect(httpResult).toEqual(unauthorized());
  });

  test('should returns 500 if Authentication throws an error', async () => {
    const { sut, authenticationStub } = makeSut();

    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(() => {
      throw new Error();
    });

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('should returns a token and status 200 after authentication credentials', async () => {
    const { sut } = makeSut();

    const httpResult = await sut.handle(httpRequest);

    expect(httpResult).toStrictEqual(ok({ token: 'any_token', name: 'any_name' }));
  });

  test('should call Validation with correct value', async () => {
    const { sut, validationStub } = makeSut();

    const validateStubSpy = jest.spyOn(validationStub, 'validate');
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);

    expect(validateStubSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  test('should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut();
    const httpRequest = makeFakeRequest();

    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'));

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')));
  });
});
