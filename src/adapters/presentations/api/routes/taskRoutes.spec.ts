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

    test("Deve retornar 204 se a lista de tarefas estiver vazia", async () => {
        await request(app).get("/api/tasks").expect(204);
    });
});