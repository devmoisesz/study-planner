import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { AppModule } from "../../app.module.js";
import { PrismaService } from "../../database/prisma.service.js";
import { createAuthenticatedUser } from "../../testing/create-authenticated-user.js";

describe("Get Task (E2E)", () => {
    let app: INestApplication;
    let prisma: PrismaService;
    let taskId: string;
    let userId: string;
    let accessToken: string;
    let otherUserId: string;
    let otherAccessToken: string;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
        app = moduleRef.createNestApplication();
        prisma = app.get(PrismaService);
        await app.init();
        await prisma.$connect();

        ({ user: { id: userId }, accessToken } = await createAuthenticatedUser(app, prisma));
        ({ user: { id: otherUserId }, accessToken: otherAccessToken } =
            await createAuthenticatedUser(app, prisma));

        const task = await prisma.task.create({
            data: {
                title: "E2E - Detalhe da tarefa",
                score: 64,
                userId,
                resources: { create: [{ title: "E2E - Apostila", type: "PDF" }] },
                productivities: { create: [{ percentage: 50 }] }
            }
        });
        taskId = task.id;
    });

    afterAll(async () => {
        await prisma.user.deleteMany({ where: { id: { in: [userId, otherUserId] } } });
        await app.close();
    });

    test("[GET] /tasks/:id", async () => {
        const response = await request(app.getHttpServer())
            .get(`/tasks/${taskId}`)
            .set("Authorization", `Bearer ${accessToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject({ id: taskId, userId, score: 64 });
        expect(response.body.resources).toHaveLength(1);
        expect(response.body.productivities).toHaveLength(1);
    });

    test("[GET] /tasks/:id returns 404 for another user's task", async () => {
        const response = await request(app.getHttpServer())
            .get(`/tasks/${taskId}`)
            .set("Authorization", `Bearer ${otherAccessToken}`);

        expect(response.statusCode).toBe(404);
    });
});
