import { Validation } from "../interfaces/validation";
import { InsufficientDataError } from "../presentations/api/errors/insufficient-data-error";

export class OneRequiredFieldValidation implements Validation {
  constructor(private readonly fields: string[]) {}
  validate(data: any): void | Error {
    const hasAtLeastOneField = this.fields.some(field => data[field]);
    if (!hasAtLeastOneField) {
      return new InsufficientDataError(this.fields);
    }
  }
}
