import { EmailValidatorAdapter } from './email-validator';

describe('Email validator adapter', () => {
  test('should return false if validator returns false', () => {
    const sut = new EmailValidatorAdapter();
    const isValid = sut.isValid('invalid-email');

    expect(isValid).toBe(false);
  });
});
