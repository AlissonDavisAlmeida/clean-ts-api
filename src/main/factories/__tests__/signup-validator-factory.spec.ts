import { RequiredFieldsValidation } from '../../../presentation/helpers/validators/required-fields-validation';
import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite';
import { makeSignupValidatorFactory } from '../signup/signup-validator-factory';

jest.mock('../../../presentation/helpers/validators/validation-composite');
describe('SignupValidator Factory', () => {
  test('should call ValidationComposite with all validations', () => {
    makeSignupValidatorFactory();

    expect(ValidationComposite).toHaveBeenCalledWith([
      new RequiredFieldsValidation(['name', 'email', 'password', 'passwordConfirmation'])
    ]);
  });
});
