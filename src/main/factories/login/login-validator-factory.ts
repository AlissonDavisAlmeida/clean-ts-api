import { RequiredFieldsValidation, ValidationComposite, EmailValidation } from '../../../presentation/helpers/validators';
import { type Validation } from '../../../presentation/protocols/validation';
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter';

export const makeLoginValidatorFactory = (): Validation => {
  const requiredFieldsValidation = new RequiredFieldsValidation(['email', 'password']);
  const emailValidation = new EmailValidation('email', new EmailValidatorAdapter());
  const validationComposite = new ValidationComposite([
    requiredFieldsValidation,
    emailValidation
  ]);
  return validationComposite;
};
