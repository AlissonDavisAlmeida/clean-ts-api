import { InvalidParamError } from '../../presentation/errors';
import { CompareFieldsValidation } from './compare-fields-validation';

describe('CompareFieldsValidation', () => {
  test('Should return a InvalidParamError if validation fails', () => {
    const sut = new CompareFieldsValidation(['field1', 'field2']);

    const error = sut.validate({ field1: 'any_value', field2: 'other_value' });

    expect(error).toEqual(new InvalidParamError('field2'));
  });

  test('Should not return if validation succeeds', () => {
    const sut = new CompareFieldsValidation(['field1', 'field2']);

    const error = sut.validate({ field1: 'any_value', field2: 'any_value' });

    expect(error).toBeNull();
  });
});
