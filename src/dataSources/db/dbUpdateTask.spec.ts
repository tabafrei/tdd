import { UpdateTaskModel, UpdateTaskRepository } from "../../usecases";
import { DbUpdateTask } from "./dbUpdateTask";

const makeFakeTask = (): UpdateTaskModel => {
  return {
    id: "any_id",
    title: "any_title",
    description: "any_description",
    date: "30/06/2024",
  }
};

const makeUpdateTaskRepository = (): UpdateTaskRepository => {
    class UpdateTaskRepositoryStub implements UpdateTaskRepository {
        async update(): Promise<Error | void> {
            return Promise.resolve();
        }
    }
    return new UpdateTaskRepositoryStub();
}

interface SutTypes {
    sut: DbUpdateTask;
    updateTaskRepositoryStub: UpdateTaskRepository;
}

const makeSut = (): SutTypes => {
    const updateTaskRepositoryStub = makeUpdateTaskRepository();
    const sut = new DbUpdateTask(updateTaskRepositoryStub);
    return {
        sut,
        updateTaskRepositoryStub
    };
};

describe("DbUpdateTask", () => {
  test("Deve chamar UpdateTaskRepository com os valores corretos", async () => {
    const { sut, updateTaskRepositoryStub } = makeSut();
    const updateSpy = jest.spyOn(updateTaskRepositoryStub, "update");
    const fakeTask = makeFakeTask();
    await sut.update(fakeTask);
    expect(updateSpy).toHaveBeenCalledWith(fakeTask);
  });

  test("Deve lançar uma exceção se UpdateTaskRepository lançar", async () => {
    const { sut, updateTaskRepositoryStub } = makeSut();
    jest.spyOn(updateTaskRepositoryStub, "update").mockRejectedValueOnce(new Error());
    const fakeTask = makeFakeTask();
    const promise = sut.update(fakeTask);
    await expect(promise).rejects.toThrow();
  });
});