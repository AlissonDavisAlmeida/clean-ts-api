import { MissingParamError } from '../../errors';
import { type Validation } from '../../protocols/validation';

export class RequiredFieldsValidation implements Validation {
  constructor (private readonly fieldNames: string[]) { }

  validate (input: any): Error | null {
    for (const fieldName of this.fieldNames) {
      if (!input[fieldName]) {
        return new MissingParamError(fieldName);
      }
    }

    return null;
  };
}
