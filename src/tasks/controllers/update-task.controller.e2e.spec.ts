import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { AppModule } from "../../app.module.js";
import { PrismaService } from "../../database/prisma.service.js";

describe("Update Task (E2E)", () => {
    let app: INestApplication;
    let prisma: PrismaService;
    let taskId: string;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
        app = moduleRef.createNestApplication();
        prisma = app.get(PrismaService);
        await app.init();
        await prisma.$connect();

        const task = await prisma.task.create({
            data: {
                title: "E2E - Título original",
                description: "Descrição original",
                score: 52
            }
        });
        taskId = task.id;
    });

    afterAll(async () => {
        await prisma.task.delete({ where: { id: taskId } });
        await app.close();
    });

    test("[PATCH] /tasks/:id", async () => {
        const response = await request(app.getHttpServer())
            .patch(`/tasks/${taskId}`)
            .send({ title: "E2E - Título atualizado", description: "" });

        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject({
            id: taskId,
            title: "E2E - Título atualizado",
            description: null,
            score: 52
        });

        await expect(prisma.task.findUnique({ where: { id: taskId } })).resolves.toMatchObject({
            title: "E2E - Título atualizado",
            description: null,
            score: 52
        });
    });
});
