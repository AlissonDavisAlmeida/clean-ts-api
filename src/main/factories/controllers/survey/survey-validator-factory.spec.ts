import { RequiredFieldsValidation, ValidationComposite } from '../../../../validation/validators';
import { makeSurveyValidatorFactory } from './survey-validator-factory';

jest.mock('../../../../validation/validators/validation-composite');

describe('LoginValidator Factory', () => {
  test('should call ValidationComposite with all validations', () => {
    makeSurveyValidatorFactory();

    expect(ValidationComposite).toHaveBeenCalledWith([
      new RequiredFieldsValidation(['question', 'answers'])
    ]);
  });
});
