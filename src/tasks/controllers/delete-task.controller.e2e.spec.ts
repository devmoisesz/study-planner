import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { AppModule } from "../../app.module.js";
import { PrismaService } from "../../database/prisma.service.js";

describe("Delete Task (E2E)", () => {
    let app: INestApplication;
    let prisma: PrismaService;
    const createdTaskIds: string[] = [];

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        app = moduleRef.createNestApplication();
        prisma = app.get(PrismaService);

        await app.init();
        await prisma.$connect();
    });

    afterAll(async () => {
        await prisma.task.deleteMany({ where: { id: { in: createdTaskIds } } });
        await app.close();
    });

    test("[DELETE] /tasks/:id", async () => {
        const task = await prisma.task.create({
            data: {
                title: "E2E - Para excluir",
                score: 55,
                resources: {
                    create: [{ title: "E2E - Material", type: "WEBSITE" }]
                }
            }
        });
        createdTaskIds.push(task.id);

        const response = await request(app.getHttpServer()).delete(
            `/tasks/${task.id}`
        );

        expect(response.statusCode).toBe(204);

        const taskOnDatabase = await prisma.task.findUnique({
            where: { id: task.id }
        });
        expect(taskOnDatabase).toBeNull();

        // onDelete Cascade: os recursos saem junto.
        const resourcesOnDatabase = await prisma.resource.findMany({
            where: { taskId: task.id }
        });
        expect(resourcesOnDatabase).toHaveLength(0);
    });

    test("[DELETE] /tasks/:id with an unknown id returns 404", async () => {
        const response = await request(app.getHttpServer()).delete(
            "/tasks/11111111-1111-4111-8111-111111111111"
        );

        expect(response.statusCode).toBe(404);
    });

    test("[DELETE] /tasks/:id with a malformed id returns 400", async () => {
        const response = await request(app.getHttpServer()).delete(
            "/tasks/nao-e-um-uuid"
        );

        expect(response.statusCode).toBe(400);
        expect(response.body).toMatchObject({ message: "Validation failed" });
    });
});
