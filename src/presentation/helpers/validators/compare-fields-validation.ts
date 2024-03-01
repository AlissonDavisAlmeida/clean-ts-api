import { InvalidParamError } from '../../errors';
import { type Validation } from '../../protocols/validation';

export class CompareFieldsValidation implements Validation {
  constructor (
    private readonly fieldsToCompare: string[]
  ) { }

  validate (input: any): Error | null {
    const [field1, field2] = this.fieldsToCompare;
    if (input[field1] !== input[field2]) {
      return new InvalidParamError(field2);
    }

    return null;
  };
}
