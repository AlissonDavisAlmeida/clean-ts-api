import { RequiredFieldsValidation } from '../../presentation/helpers/validators/required-fields-validation';
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite';
import { type Validation } from '../../presentation/protocols/validation';

export const makeSignupValidatorFactory = (): Validation => {
  const requiredFieldsValidation = new RequiredFieldsValidation(['name', 'email', 'password', 'passwordConfirmation']);
  const validationComposite = new ValidationComposite([
    requiredFieldsValidation
  ]);
  return validationComposite;
};