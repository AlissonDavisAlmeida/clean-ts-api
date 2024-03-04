import { MissingParamError } from '../../errors';
import { type Validation } from '../../protocols/validation';
import { ValidationComposite } from './validation-composite';

interface SutTypes {
  sut: ValidationComposite
  validationStub: Validation
}

class ValidationStub implements Validation {
  validate (input: any) {
    return new MissingParamError('field');
  }
}

const makeSut = (): SutTypes => {
  const validationStub = new ValidationStub();
  const sut = new ValidationComposite([
    validationStub
  ]);

  return {
    sut,
    validationStub
  };
};

describe('Validation Composite', () => {
  test('should returns an error if any validation fails', () => {
    const { sut } = makeSut();
    const error = sut.validate({ field: 'any_value' });

    expect(error).toEqual(new MissingParamError('field'));
  });
});
