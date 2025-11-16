import { DateValidatorAdapter } from "../dateValidatorAdapter";
import { Validation } from "../interfaces/validation";
import { DateValidation } from "../validations/dateValidation";
import { OneRequiredFieldValidation } from "../validations/oneRequiredFieldValidation";
import { RequiredFieldsValidation } from "../validations/requiredFieldsValidation";
import { ValidationComposite } from "../validations/validationComposite";

export const updateTaskValidationCompositeFactory = (): ValidationComposite => {
  const validations: Validation[] = [];
  validations.push(new RequiredFieldsValidation("id"));
  validations.push(new OneRequiredFieldValidation(["title", "description", "date"]));
  // validations.push(new DateValidation("date", new DateValidatorAdapter())); // TODO : verificar se a data é válida apenas se fornecida
  return new ValidationComposite(validations);
};
