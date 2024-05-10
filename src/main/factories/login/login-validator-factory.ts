import { EmailValidatorAdapter } from '@/main/adapters/validators/email/email-validator-adapter';
import { RequiredFieldsValidation, ValidationComposite, EmailValidation } from '@/presentation/helpers/validators';
import { type Validation } from '@/presentation/protocols/validation';

export const makeLoginValidatorFactory = (): Validation => {
  const requiredFieldsValidation = new RequiredFieldsValidation(['email', 'password']);
  const emailValidation = new EmailValidation('email', new EmailValidatorAdapter());
  const validationComposite = new ValidationComposite([
    requiredFieldsValidation,
    emailValidation
  ]);
  return validationComposite;
};
