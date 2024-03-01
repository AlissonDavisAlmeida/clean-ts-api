import { RequiredFieldsValidation, ValidationComposite, CompareFieldsValidation } from '../../../presentation/helpers/validators';
import { type Validation } from '../../../presentation/protocols/validation';

export const makeSignupValidatorFactory = (): Validation => {
  const requiredFieldsValidation = new RequiredFieldsValidation(['name', 'email', 'password', 'passwordConfirmation']);
  const compareFieldsValidation = new CompareFieldsValidation(['password', 'passwordConfirmation']);
  const validationComposite = new ValidationComposite([
    requiredFieldsValidation,
    compareFieldsValidation
  ]);
  return validationComposite;
};
