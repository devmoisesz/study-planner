import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { AppModule } from "../../app.module.js";
import { PrismaService } from "../../database/prisma.service.js";
import { createAuthenticatedUser } from "../../testing/create-authenticated-user.js";

describe("List Tasks (E2E)", () => {
    let app: INestApplication;
    let prisma: PrismaService;
    let userId: string;
    let accessToken: string;
    let otherUserId: string;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
        app = moduleRef.createNestApplication();
        prisma = app.get(PrismaService);
        await app.init();
        await prisma.$connect();

        ({ user: { id: userId }, accessToken } = await createAuthenticatedUser(app, prisma));
        ({ user: { id: otherUserId } } = await createAuthenticatedUser(app, prisma));

        await prisma.task.createMany({
            data: [
                { title: "E2E - Prioridade baixa", score: 20, userId },
                { title: "E2E - Prioridade alta", score: 90, userId },
                { title: "E2E - Outra pessoa", score: 100, userId: otherUserId }
            ]
        });
    });

    afterAll(async () => {
        await prisma.user.deleteMany({ where: { id: { in: [userId, otherUserId] } } });
        await app.close();
    });

    test("[GET] /tasks/list returns only the authenticated user tasks", async () => {
        const response = await request(app.getHttpServer())
            .get("/tasks/list")
            .set("Authorization", `Bearer ${accessToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(2);
        expect(response.body.every((task: { userId: string }) => task.userId === userId))
            .toBe(true);
    });
});
