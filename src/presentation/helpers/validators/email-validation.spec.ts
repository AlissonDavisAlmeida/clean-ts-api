import { InvalidParamError } from '../../errors';
import { type EmailValidator } from '../../protocols/emailValidator';
import { EmailValidation } from './email-validation';

interface SutTypes {
  sut: EmailValidation
  emailValidatorStub: EmailValidator
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const sut = new EmailValidation('email', emailValidatorStub);

  return {
    sut,
    emailValidatorStub
  };
};

describe('Email Validation', () => {
  test('should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidMethodSpy = jest.spyOn(emailValidatorStub, 'isValid');
    const email = 'any_mail@mail.com';

    sut.validate({
      email
    });

    expect(isValidMethodSpy).toHaveBeenCalledWith(email);
  });

  test('should throw if EmailValidator throws an error', () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });

    expect(sut.validate).toThrow();
  });

  test('should return an error if EmailValidator returns false', () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);

    const error = sut.validate({
      email: 'invalid_email@mail.com'
    });

    expect(error).toEqual(new InvalidParamError('email'));
  });
});
