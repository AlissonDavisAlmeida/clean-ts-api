import { RequiredFieldsValidation, ValidationComposite } from '../../../../validation/validators';
import { type Validation } from '../../../../presentation/protocols/validation';

export const makeSurveyValidatorFactory = (): Validation => {
  const requiredFieldsValidation = new RequiredFieldsValidation(['question', 'answers']);
  const validationComposite = new ValidationComposite([
    requiredFieldsValidation

  ]);
  return validationComposite;
};
