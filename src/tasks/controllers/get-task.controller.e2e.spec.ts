import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { AppModule } from "../../app.module.js";
import { PrismaService } from "../../database/prisma.service.js";

describe("Get Task (E2E)", () => {
    let app: INestApplication;
    let prisma: PrismaService;
    let taskId: string;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        app = moduleRef.createNestApplication();
        prisma = app.get(PrismaService);
        await app.init();
        await prisma.$connect();

        const task = await prisma.task.create({
            data: {
                title: "E2E - Detalhe da tarefa",
                score: 64,
                resources: { create: [{ title: "E2E - Apostila", type: "PDF" }] },
                productivities: { create: [{ percentage: 50 }] }
            }
        });
        taskId = task.id;
    });

    afterAll(async () => {
        await prisma.task.delete({ where: { id: taskId } });
        await app.close();
    });

    test("[GET] /tasks/:id", async () => {
        const response = await request(app.getHttpServer()).get(`/tasks/${taskId}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject({
            id: taskId,
            title: "E2E - Detalhe da tarefa",
            score: 64
        });
        expect(response.body.resources).toEqual([
            expect.objectContaining({ title: "E2E - Apostila", type: "PDF" })
        ]);
        expect(response.body.productivities).toEqual([
            expect.objectContaining({ percentage: 50, taskId })
        ]);
    });

    test("[GET] /tasks/:id returns 404 for an unknown task", async () => {
        const response = await request(app.getHttpServer()).get(
            "/tasks/11111111-1111-4111-8111-111111111111"
        );

        expect(response.statusCode).toBe(404);
    });
});
