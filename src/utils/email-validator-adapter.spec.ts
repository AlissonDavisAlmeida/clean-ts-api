import { EmailValidatorAdapter } from './email-validator';
import validator from 'validator';

jest.mock('validator', () => ({
  isEmail (): boolean {
    return true;
  }
}));

describe('Email validator adapter', () => {
  test('should return false if validator returns false', () => {
    const sut = new EmailValidatorAdapter();
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false);
    const isValid = sut.isValid('invalid-email');

    expect(isValid).toBe(false);
  });
  test('should return true if validator returns true', () => {
    const sut = new EmailValidatorAdapter();
    const isValid = sut.isValid('valid-email@gmail.com');

    expect(isValid).toBe(true);
  });
  test('should call validator with correct email', () => {
    const email = 'valid-email@gmail.com';
    const isEmailSpy = jest.spyOn(validator, 'isEmail');
    const sut = new EmailValidatorAdapter();
    sut.isValid(email);

    expect(isEmailSpy).toHaveBeenCalledWith(email);
  });
});
