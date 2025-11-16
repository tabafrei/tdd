import { ObjectId } from "mongodb";
import { MongoManager } from "../../config/mongoManager";
import { TaskMongoRepository } from "./taskMongoRepository";
import { InvalidParamError, NotFoundError } from "../../../adapters/presentations/api/errors";

const makeSut = (): TaskMongoRepository => {
    const sut = new TaskMongoRepository();
    return sut;
}

describe("TaskMongoRepository", () => {
    const client = MongoManager.getInstance();
    beforeAll(async () => {
        await client.connect(process.env.MONGO_URL as string);
    });

    afterAll(async () => {
        await client.disconnect();
    });

    beforeEach(async () => {
        await client.getCollection("tasks").drop();
    });

    test("Deve retornar a tarefa em caso de sucesso", async () => {
        const sut = makeSut();
        await sut.add({
            title: "any_title",
            description: "any_description",
            date: "30/06/2024",
        });
        const tasks = await sut.list();
        expect(tasks[0].id).toBeTruthy();
        expect(tasks[0].title).toBe("any_title");
        expect(tasks[0].description).toBe("any_description");
        expect(tasks[0].date).toBe("30/06/2024");
        expect(tasks.length).toBe(1);
    });

    test("Deve atualizar a tarefa em caso de sucesso", async () => {
        const sut = makeSut();
        const addedTask = await sut.add({
            title: "any_title",
            description: "any_description",
            date: "30/06/2024",
        });
        await sut.update({
            id: addedTask.id,
            title: "updated_title",
            description: "updated_description",
            date: "01/07/2024",
        });
        const updatedTask = await client.getCollection("tasks").findOne({ _id: new ObjectId(addedTask.id) });
        expect(updatedTask).toBeTruthy();
        expect(updatedTask?.title).toBe("updated_title");
        expect(updatedTask?.description).toBe("updated_description");
        expect(updatedTask?.date).toBe("01/07/2024");
    });

    test("Deve retornar InvalidParamError se id for inválido na atualização", async () => {
        const sut = makeSut();
        const error = await sut.update({
            id: "invalid_id",
            title: "updated_title",
            description: "updated_description",
            date: "01/07/2024",
        });
        expect(error).toEqual(new InvalidParamError("invalid_id"));
    });

    test("Deve retornar notFoundError se id não existir na atualização", async () => {
        const sut = makeSut();
        const error = await sut.update({
            id: new ObjectId().toHexString(),
            title: "updated_title",
            description: "updated_description",
            date: "01/07/2024",
        });
        expect(error).toEqual(new NotFoundError("task"));
    });
});