import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { AppModule } from "../../app.module.js";
import { PrismaService } from "../../database/prisma.service.js";
import { createAuthenticatedUser } from "../../testing/create-authenticated-user.js";

describe("Increase Priority (E2E)", () => {
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

    test("[POST] /tasks/:id/priority-boost increases the score", async () => {
        const task = await prisma.task.create({
            data: { title: "E2E - Aumentar prioridade", score: 39, userId }
        });

        const response = await request(app.getHttpServer())
            .post(`/tasks/${task.id}/priority-boost`)
            .set("Authorization", `Bearer ${accessToken}`)
            .send({ percentage: 0.5 });

        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject({ id: task.id, score: 59 });
    });
});
