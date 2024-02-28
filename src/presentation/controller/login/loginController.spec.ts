import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter';
import { MissingParamError } from '../../errors';
import { badRequest } from '../../helpers/httpHelper';
import { type HttpRequest } from '../../protocols';
import { LoginController } from './loginController';

interface SutTypes {
  sut: LoginController
  emailValidator: EmailValidatorAdapter
}

const makeSut = (): SutTypes => {
  const emailValidator = new EmailValidatorAdapter();
  const sut = new LoginController(emailValidator);
  return {
    sut,
    emailValidator
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
});
