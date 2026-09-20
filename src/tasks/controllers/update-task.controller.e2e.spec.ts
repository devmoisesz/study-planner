import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { AppModule } from "../../app.module.js";
import { PrismaService } from "../../database/prisma.service.js";
import { createAuthenticatedUser } from "../../testing/create-authenticated-user.js";

describe("Update Task (E2E)", () => {
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
        taskId = (await prisma.task.create({
            data: { title: "E2E - Título original", score: 52, userId }
        })).id;
    });

    afterAll(async () => {
        await prisma.user.deleteMany({ where: { id: { in: [userId, otherUserId] } } });
        await app.close();
    });

    test("[PATCH] /tasks/:id", async () => {
        const response = await request(app.getHttpServer())
            .patch(`/tasks/${taskId}`)
            .set("Authorization", `Bearer ${accessToken}`)
            .send({ title: "E2E - Título atualizado", description: "" });

        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject({ id: taskId, title: "E2E - Título atualizado" });
    });

    test("[PATCH] /tasks/:id does not update another user's task", async () => {
        const response = await request(app.getHttpServer())
            .patch(`/tasks/${taskId}`)
            .set("Authorization", `Bearer ${otherAccessToken}`)
            .send({ title: "Tentativa indevida", description: "" });

        expect(response.statusCode).toBe(404);
    });
});
