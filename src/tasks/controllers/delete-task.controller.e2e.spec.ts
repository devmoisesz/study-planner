import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { AppModule } from "../../app.module.js";
import { PrismaService } from "../../database/prisma.service.js";
import { createAuthenticatedUser } from "../../testing/create-authenticated-user.js";

describe("Delete Task (E2E)", () => {
    let app: INestApplication;
    let prisma: PrismaService;
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
    });

    afterAll(async () => {
        await prisma.user.deleteMany({ where: { id: { in: [userId, otherUserId] } } });
        await app.close();
    });

    test("[DELETE] /tasks/:id", async () => {
        const task = await prisma.task.create({
            data: {
                title: "E2E - Para excluir",
                score: 55,
                userId,
                resources: { create: [{ title: "E2E - Material", type: "WEBSITE" }] }
            }
        });

        const response = await request(app.getHttpServer())
            .delete(`/tasks/${task.id}`)
            .set("Authorization", `Bearer ${accessToken}`);

        expect(response.statusCode).toBe(204);
        await expect(prisma.task.findUnique({ where: { id: task.id } })).resolves.toBeNull();
    });

    test("[DELETE] /tasks/:id does not delete another user's task", async () => {
        const task = await prisma.task.create({
            data: { title: "E2E - Protegida", score: 55, userId }
        });

        const response = await request(app.getHttpServer())
            .delete(`/tasks/${task.id}`)
            .set("Authorization", `Bearer ${otherAccessToken}`);

        expect(response.statusCode).toBe(404);
        await expect(prisma.task.findUnique({ where: { id: task.id } })).resolves.not.toBeNull();
    });

    test("[DELETE] /tasks/:id with a malformed id returns 400", async () => {
        const response = await request(app.getHttpServer())
            .delete("/tasks/nao-e-um-uuid")
            .set("Authorization", `Bearer ${accessToken}`);

        expect(response.statusCode).toBe(400);
    });
});
