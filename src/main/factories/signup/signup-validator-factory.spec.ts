import { CompareFieldsValidation } from '@/presentation/helpers/validators';
import { EmailValidation } from '@/presentation/helpers/validators/email-validation';
import { RequiredFieldsValidation } from '@/presentation/helpers/validators/required-fields-validation';
import { ValidationComposite } from '@/presentation/helpers/validators/validation-composite';
import { type EmailValidator } from '@/presentation/protocols/emailValidator';
import { makeSignupValidatorFactory } from './signup-validator-factory';

jest.mock('../../../presentation/helpers/validators/validation-composite');

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
