import { ListTasksController } from "./listTasks";
import { ListTasks } from "../../../usecases/listTasks";
import { Task } from "../../../entities/task";
import { noContent, ok, serverError } from "../../presentations/api/httpResponses/httpResponses";

const makeSut = (): SutTypes => {
    const listTasksStub = makeListTasks();
    const sut = new ListTasksController(listTasksStub);
    return {
      sut,
      listTasksStub      
    };
}

interface SutTypes {
  listTasksStub: ListTasks;
  sut: ListTasksController;
}

const makeFakeTasks = (): Task[] => {
  return [
  {
    id: "any_id",
    title: "any_title",
    description: "any_description",
    date: "30/06/2024",
  },
  {
    id: "other_id",
    title: "other_title",
    description: "other_description",
    date: "31/07/2025",
  }
]};

const makeListTasks = (): ListTasks => {
  class ListTasksStub implements ListTasks {
    async list(): Promise<Task[]> {
      return Promise.resolve(makeFakeTasks());
    }
  }
  return new ListTasksStub();
}

describe("ListTasks Controller", () => {
  test("Deve retornar 204 se a lista estiver vazia", async () => {
    const { sut, listTasksStub } = makeSut();
    jest.spyOn(listTasksStub, "list").mockReturnValueOnce(Promise.resolve([]));
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(noContent());
  });

  test("Deve retornar 200 com a lista de tarefas", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(ok(makeFakeTasks()));
  });

  test("Deve listar tarefas corretamente", async () => {
    const { sut, listTasksStub } = makeSut();
    const listSpy = jest.spyOn(listTasksStub, "list");
    await sut.handle({});
    expect(listSpy).toHaveBeenCalled();
  });

  test("Deve retornar 500 se lançar uma exceção", async () => {
    const { sut, listTasksStub } = makeSut();
    jest
      .spyOn(listTasksStub, "list")
      .mockReturnValueOnce(Promise.reject(new Error()));
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(serverError(new Error()));
  });

});