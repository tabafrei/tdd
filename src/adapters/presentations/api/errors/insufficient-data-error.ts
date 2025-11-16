export class InsufficientDataError extends Error {
  constructor(fields: string[]) {
    super(`At least one of the following fields is required: ${fields.join(", ")}`);
    this.name = "InsufficientDataError";
  }
}
