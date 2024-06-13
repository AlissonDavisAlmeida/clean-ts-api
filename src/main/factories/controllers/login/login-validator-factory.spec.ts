import { EmailValidation, RequiredFieldsValidation, ValidationComposite } from '../../../../validation/validators';
import { type EmailValidator } from '../../../../validation/protocols/emailValidator';
import { makeLoginValidatorFactory } from './login-validator-factory';

jest.mock('../../../../validation/validators/validation-composite');

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};
describe('LoginValidator Factory', () => {
  test('should call ValidationComposite with all validations', () => {
    makeLoginValidatorFactory();

    expect(ValidationComposite).toHaveBeenCalledWith([
      new RequiredFieldsValidation(['email', 'password']),
      new EmailValidation('email', makeEmailValidator())
    ]);
  });
});
