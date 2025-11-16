import { UpdateTask, UpdateTaskModel } from "../../../usecases/updateTask";
import { updateTaskValidationCompositeFactory } from "../../factories/updateTaskValidationCompositeFactory";
import { HttpRequest, Validation } from "../../interfaces";
import { MissingParamError } from "../../presentations/api/errors";
import { badRequest, noContent, serverError } from "../../presentations/api/httpResponses/httpResponses";
import { UpdateTaskController } from "./updateTask";

const makeSut = (): SutTypes => {
    const updateTaskStub = makeUpdateTask();
    const validationStub = makeValidation();
    const sut = new UpdateTaskController(updateTaskStub, validationStub);
    return {
      sut,
      updateTaskStub,
      validationStub
    };
}

interface SutTypes {
  updateTaskStub: UpdateTask;
  sut: UpdateTaskController;
  validationStub: Validation;
}

const makeFakeRequest = (): HttpRequest => {
  return {
    body: {
      id: "any_id",
      title: "updated_title",
      description: "updated_description",
      date: "01/01/2025",
    }
  };
};

const makeUpdateTask = (): UpdateTask => {
  class UpdateTaskStub implements UpdateTask {
    async update(task: UpdateTaskModel): Promise<void | Error> {
      return Promise.resolve();
    }
  }
  return new UpdateTaskStub();
}

const makeValidation = () => {
  class ValidationStub implements Validation {
    validate(input: any): Error | undefined {
      return;
    }
  }
  return new ValidationStub();
}

describe("UpdateTask Controller", () => {
    test("Deve retornar 204 em caso de sucesso", async () => {
      const { sut } = makeSut();
      const httpResponse = await sut.handle(makeFakeRequest());
      expect(httpResponse).toEqual(noContent());
    });

    test("Deve retornar 500 se UpdateTask lançar uma exceção", async () => {
      const { sut, updateTaskStub } = makeSut();
      jest.spyOn(updateTaskStub, "update").mockRejectedValueOnce(new Error());
      const httpResponse = await sut.handle(makeFakeRequest());
      expect(httpResponse).toEqual(serverError(new Error()));
    });

    test("Deve retornar 400 se a validação falhar", async () => {
      const { sut, validationStub } = makeSut();
      jest.spyOn(validationStub, "validate").mockReturnValueOnce(new Error());
      const httpResponse = await sut.handle(makeFakeRequest());
      expect(httpResponse.statusCode).toBe(400);
      expect(httpResponse.body).toEqual(new Error());
      expect(httpResponse).toEqual(badRequest(new Error())); // Outra forma de fazer ao inves de verificar statusCode e body separadamente
    });

    test("Deve chamar UpdateTask com os valores corretos quando apenas uma parte dos parâmetros for enviado", async () => {
      const { sut, updateTaskStub } = makeSut();
      const updateSpy = jest.spyOn(updateTaskStub, "update");
      await sut.handle({
        body: {
          id: "any_id",
          title: "updated_title",
        }
      });
      expect(updateSpy).toHaveBeenCalledWith({
        id: "any_id",
        title: "updated_title",
      });
    });

    test("Deve chamar UpdateTask com os valores corretos quando todos os parâmetros forem enviados", async () => {
      const { sut, updateTaskStub } = makeSut();
      const updateSpy = jest.spyOn(updateTaskStub, "update");
      await sut.handle(makeFakeRequest());
      expect(updateSpy).toHaveBeenCalledWith({
        id: "any_id",
        title: "updated_title",
        description: "updated_description",
        date: "01/01/2025",
      });
    });
});
