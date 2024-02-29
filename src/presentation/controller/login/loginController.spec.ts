import { type Authentication, type AuthenticationParams } from '../../../domain/useCases/authentication';
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter';
import { InvalidParamError, MissingParamError, ServerError } from '../../errors';
import { badRequest, serverError } from '../../helpers/httpHelper';
import { type HttpRequest } from '../../protocols';
import { LoginController } from './loginController';

interface SutTypes {
  sut: LoginController
  emailValidator: EmailValidatorAdapter
  authenticationStub: Authentication
}

const httpRequest: HttpRequest = {
  body: {
    email: 'any_email@mail.com',
    password: 'any_password'
  }
};

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authentication: AuthenticationParams): Promise<string> {
      return 'any_token';
    }
  }

  return new AuthenticationStub();
};

const makeSut = (): SutTypes => {
  const emailValidator = new EmailValidatorAdapter();
  const authenticationStub = makeAuthentication();
  const sut = new LoginController(emailValidator, authenticationStub);
  return {
    sut,
    emailValidator,
    authenticationStub
  };
};

describe('Login Controller', () => {
  test("should returns 400 status if email isn't provided", async () => {
    const { sut } = makeSut();
    const httpRequest: HttpRequest = {
      body: {
        email: '',
        password: 'any_password'
      }
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toStrictEqual(badRequest(new MissingParamError('email')));
  });
  test("should returns 400 status if password isn't provided", async () => {
    const { sut } = makeSut();
    const httpRequest: HttpRequest = {
      body: {
        email: 'any_mail@mail.com',
        password: ''
      }
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toStrictEqual(badRequest(new MissingParamError('password')));
  });
  test('should returns 400 status if email is invalid', async () => {
    const { sut } = makeSut();
    const httpRequest: HttpRequest = {
      body: {
        email: 'email_invalid_mail.com',
        password: 'any_password'
      }
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toStrictEqual(badRequest(new InvalidParamError('email')));
  });
  test('should calls EmailValidator with correct email', async () => {
    const { sut, emailValidator } = makeSut();
    const httpRequest: HttpRequest = {
      body: {
        email: 'email@mail.com',
        password: 'any_password'
      }
    };

    const isValidSpy = jest.spyOn(emailValidator, 'isValid');

    await sut.handle(httpRequest);

    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body?.email);
  });

  test('should returns 500 if EmailValidator throws', async () => {
    const { sut, emailValidator } = makeSut();

    jest.spyOn(emailValidator, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(serverError(new ServerError('any_stack')));
  });

  test('should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut();

    const authSpy = jest.spyOn(authenticationStub, 'auth');

    await sut.handle(httpRequest);

    expect(authSpy).toHaveBeenCalledWith({
      email: httpRequest.body?.email,
      password: httpRequest.body?.password
    });
  });
});
