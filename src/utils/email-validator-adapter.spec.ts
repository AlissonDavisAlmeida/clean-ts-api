import { EmailValidatorAdapter } from './email-validator-adapter';
import validator from 'validator';

jest.mock('validator', () => ({
  isEmail (): boolean {
    return true;
  }
}));

const makeSut = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter();
};

describe('Email validator adapter', () => {
  test('should return false if validator returns false', () => {
    const sut = makeSut();
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false);
    const isValid = sut.isValid('invalid-email');

    expect(isValid).toBe(false);
  });
  test('should return true if validator returns true', () => {
    const sut = makeSut();
    const isValid = sut.isValid('valid-email@gmail.com');

    expect(isValid).toBe(true);
  });
  test('should call validator with correct email', () => {
    const email = 'valid-email@gmail.com';
    const isEmailSpy = jest.spyOn(validator, 'isEmail');
    const sut = makeSut();
    sut.isValid(email);

    expect(isEmailSpy).toHaveBeenCalledWith(email);
  });
});
