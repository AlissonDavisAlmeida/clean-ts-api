import { CompareFieldsValidation } from '@/validation/validators';
import { EmailValidation } from '@/validation/validators/email-validation';
import { RequiredFieldsValidation } from '@/validation/validators/required-fields-validation';
import { ValidationComposite } from '@/validation/validators/validation-composite';
import { makeSignupValidatorFactory } from './signup-validator-factory';
import { type EmailValidator } from '@/validation/protocols/emailValidator';

jest.mock('../../../../validation/validators/validation-composite');

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};
describe('SignupValidator Factory', () => {
  test('should call ValidationComposite with all validations', () => {
    makeSignupValidatorFactory();

    expect(ValidationComposite).toHaveBeenCalledWith([
      new RequiredFieldsValidation(['name', 'email', 'password', 'passwordConfirmation']),
      new CompareFieldsValidation(['password', 'passwordConfirmation']),
      new EmailValidation('email', makeEmailValidator())
    ]);
  });
});
