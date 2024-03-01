import { RequiredFieldsValidation, ValidationComposite, CompareFieldsValidation } from '../../../presentation/helpers/validators';
import { EmailValidation } from '../../../presentation/helpers/validators/email-validation';
import { type Validation } from '../../../presentation/protocols/validation';
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter';

export const makeSignupValidatorFactory = (): Validation => {
  const requiredFieldsValidation = new RequiredFieldsValidation(['name', 'email', 'password', 'passwordConfirmation']);
  const compareFieldsValidation = new CompareFieldsValidation(['password', 'passwordConfirmation']);
  const emailValidation = new EmailValidation('email', new EmailValidatorAdapter());
  const validationComposite = new ValidationComposite([
    requiredFieldsValidation,
    compareFieldsValidation,
    emailValidation
  ]);
  return validationComposite;
};
