import { Task } from "../../entities/task";
import { DbListTasks } from "./dbListTasks";
import { ListTasksRepository } from "./repository/listTasksRepository";

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

const makeListTaskRepository = (): ListTasksRepository => {
    class ListTaskRepositoryStub implements ListTasksRepository {
        async list(): Promise<Task[]> {
            return Promise.resolve(makeFakeTasks());
        }
    }
    return new ListTaskRepositoryStub();
}

interface SutTypes {
    sut: DbListTasks;
    listTaskRepositoryStub: ListTasksRepository;
}

const makeSut = (): SutTypes => {
    const listTaskRepositoryStub = makeListTaskRepository();
    const sut = new DbListTasks(listTaskRepositoryStub);
    return {
        sut,
        listTaskRepositoryStub
    };
};

describe("DbListTasks", () => {
  test("Deve chamar ListTaskRepository", async () => {
    const { sut, listTaskRepositoryStub } = makeSut();
    const listSpy = jest.spyOn(listTaskRepositoryStub, "list");
    await sut.list();
    expect(listSpy).toHaveBeenCalled();
  });

  test("Deve retornar uma lista de tarefas", async () => {
    const { sut } = makeSut();
    const tasks = await sut.list();
    expect(tasks).toEqual(makeFakeTasks());
  });

  test("Deve lançar uma exceção se ListTaskRepository lançar", async () => {
    const { sut, listTaskRepositoryStub } = makeSut();
    jest
      .spyOn(listTaskRepositoryStub, "list")
      .mockReturnValueOnce(Promise.reject(new Error()));
    const promise = sut.list();
    await expect(promise).rejects.toThrow();
  });
});