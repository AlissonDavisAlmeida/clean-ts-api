import { RequiredFieldsValidation, ValidationComposite, CompareFieldsValidation } from '@/validation/validators';
import { EmailValidation } from '@/validation/validators/email-validation';
import { type Validation } from '@/presentation/protocols/validation';
import { EmailValidatorAdapter } from '@/infra/validators/email/email-validator-adapter';

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
