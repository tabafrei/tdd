import { MongoManager } from "../../config/mongoManager";
import { TaskMongoRepository } from "./taskMongoRepository";

const makeSut = (): TaskMongoRepository => {
    const sut = new TaskMongoRepository();
    return sut;
}

describe("TaskMongoRepository", () => {
    const client = MongoManager.getInstance();
    beforeAll(async () => {
        await client.connect(process.env.MONGO_URL as string);
    });

    test("Deve retornar a tarefa em caso de sucesso", async () => {
        const sut = makeSut();
        const task = await sut.add({
            title: "any_title",
            description: "any_description",
            date: "30/06/2024",
        });
        expect(task.id).toBeTruthy();
        expect(task.title).toBe("any_title");
        expect(task.description).toBe("any_description");
        expect(task.date).toBe("30/06/2024");
    });

    afterAll(async () => {
        await client.disconnect();
    });

});