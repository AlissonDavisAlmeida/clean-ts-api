import { InvalidParamError, MissingParamError } from '../../presentation/errors';
import { type Validation } from '../../presentation/protocols/validation';
import { ValidationComposite } from './validation-composite';

interface SutTypes {
  sut: ValidationComposite
  validationStub: Validation
  validationStub2: Validation
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any) {
      return null;
    }
  }

  return new ValidationStub();
};

const makeSut = (): SutTypes => {
  const validationStub = makeValidation();
  const validationStub2 = makeValidation();
  const sut = new ValidationComposite([
    validationStub,
    validationStub2
  ]);

  return {
    sut,
    validationStub,
    validationStub2
  };
};

describe('Validation Composite', () => {
  test('should returns an error if any validation fails', () => {
    const { sut, validationStub } = makeSut();
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('field'));
    const error = sut.validate({ field: 'any_value' });

    expect(error).toEqual(new MissingParamError('field'));
  });

  test('should return the first error if more than one validation fails', () => {
    const { sut, validationStub, validationStub2 } = makeSut();
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new InvalidParamError('field'));
    jest.spyOn(validationStub2, 'validate').mockReturnValueOnce(new MissingParamError('field'));
    const error = sut.validate({ field: 'any_value' });

    expect(error).toEqual(new InvalidParamError('field'));
  });

  test('should not return if validation succeeds', () => {
    const { sut } = makeSut();
    const error = sut.validate({ field: 'any_value' });

    expect(error).toBeNull();
  });
});
