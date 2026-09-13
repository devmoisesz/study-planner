import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { AppModule } from "../../app.module.js";
import { PrismaService } from "../../database/prisma.service.js";

describe("Increase Priority (E2E)", () => {
    let app: INestApplication;
    let prisma: PrismaService;
    const createdTaskIds: string[] = [];

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
        app = moduleRef.createNestApplication();
        prisma = app.get(PrismaService);
        await app.init();
        await prisma.$connect();
    });

    afterAll(async () => {
        await prisma.task.deleteMany({ where: { id: { in: createdTaskIds } } });
        await app.close();
    });

    test("[POST] /tasks/:id/priority-boost increases the score", async () => {
        const task = await prisma.task.create({
            data: { title: "E2E - Aumentar prioridade", score: 39 }
        });
        createdTaskIds.push(task.id);

        const response = await request(app.getHttpServer())
            .post(`/tasks/${task.id}/priority-boost`)
            .send({ percentage: 0.5 });

        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject({ id: task.id, score: 59 });
        await expect(prisma.task.findUnique({ where: { id: task.id } })).resolves.toMatchObject({
            score: 59
        });
    });

    test("[POST] /tasks/:id/priority-boost caps the score at 100", async () => {
        const task = await prisma.task.create({
            data: { title: "E2E - Teto de prioridade", score: 81 }
        });
        createdTaskIds.push(task.id);

        const response = await request(app.getHttpServer())
            .post(`/tasks/${task.id}/priority-boost`)
            .send({ percentage: 0.9 });

        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject({ id: task.id, score: 100 });
    });
});
