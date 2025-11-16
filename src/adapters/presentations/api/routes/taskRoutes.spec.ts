import { MongoManager } from "../../../../dataSources";
import request from "supertest";
import app from "../config/app";

describe("TaskRoutes", () => {
    const client = MongoManager.getInstance();
    beforeAll(async () => {
        await client.connect(process.env.MONGO_URL as string);
    });

    afterAll(async () => {
        await client.disconnect();
    });

    beforeEach(async () => {
        // await client.getCollection("tasks").drop();
        await client.getCollection("tasks").deleteMany({});
    });

    test("Deve retornar 204 se a lista de tarefas estiver vazia", async () => {
        await request(app).get("/api/tasks").expect(204);
    });

    test("Deve retornar 204 após atualizar uma tarefa com sucesso", async () => {
        const task = await client.getCollection("tasks").insertOne({
            title: "any_title",
            description: "any_description",
            date: "30/06/2024",
        });
        await request(app)
          .put("/api/tasks")
          .send({
            id: task.insertedId.toHexString(),
            title: "new_title",
            description: "new_description",
            date: "31/07/2025",
          })
          .expect(204);
    });
});