import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { AppModule } from "../../app.module.js";
import { PrismaService } from "../../database/prisma.service.js";
import { createAuthenticatedUser } from "../../testing/create-authenticated-user.js";

describe("Log Productivity (E2E)", () => {
    let app: INestApplication;
    let prisma: PrismaService;
    let userId: string;
    let accessToken: string;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
        app = moduleRef.createNestApplication();
        prisma = app.get(PrismaService);
        await app.init();
        await prisma.$connect();
        ({ user: { id: userId }, accessToken } = await createAuthenticatedUser(app, prisma));
    });

    afterAll(async () => {
        await prisma.user.delete({ where: { id: userId } });
        await app.close();
    });

    test("[POST] /tasks/:id/productivities", async () => {
        const task = await prisma.task.create({
            data: { title: "E2E - Registrar produtividade", score: 70, userId }
        });

        const response = await request(app.getHttpServer())
            .post(`/tasks/${task.id}/productivities`)
            .set("Authorization", `Bearer ${accessToken}`)
            .send({ percentage: 0.5 });

        expect(response.statusCode).toBe(201);
        expect(response.body).toMatchObject({ taskId: task.id, percentage: 50 });
        await expect(prisma.task.findUnique({ where: { id: task.id } }))
            .resolves.toMatchObject({ score: 35 });
    });
});
