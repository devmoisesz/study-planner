import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { AppModule } from "../../app.module.js";
import { PrismaService } from "../../database/prisma.service.js";

describe("Log Productivity (E2E)", () => {
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

    test("[POST] /tasks/:id/productivities", async () => {
        const task = await prisma.task.create({
            data: {
                title: "E2E - Registrar produtividade",
                score: 70
            }
        });
        createdTaskIds.push(task.id);

        const response = await request(app.getHttpServer())
            .post(`/tasks/${task.id}/productivities`)
            .send({ percentage: 0.5 });

        expect(response.statusCode).toBe(201);
        expect(response.body).toMatchObject({
            taskId: task.id,
            percentage: 50
        });

        const taskOnDatabase = await prisma.task.findUnique({
            where: { id: task.id }
        });
        expect(taskOnDatabase?.score).toBe(35);

        const productivityOnDatabase = await prisma.productivity.findUnique({
            where: { id: response.body.id }
        });
        expect(productivityOnDatabase).toMatchObject({
            taskId: task.id,
            percentage: 50
        });
    });
});
