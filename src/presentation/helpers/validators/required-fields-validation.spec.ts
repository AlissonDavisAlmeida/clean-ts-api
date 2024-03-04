import { MissingParamError } from '../../errors';
import { RequiredFieldsValidation } from './required-fields-validation';

describe('RequiredFieldsValidation', () => {
  test('Should return a MissingParamError if validation fails', () => {
    const sut = new RequiredFieldsValidation(['field']);

    const error = sut.validate({});

    expect(error).toEqual(new MissingParamError('field'));
  });

  test('Should not return if validation succeeds', () => {
    const sut = new RequiredFieldsValidation(['field']);

    const error = sut.validate({ field: 'any_value' });

    expect(error).toBeFalsy();
  });
});
