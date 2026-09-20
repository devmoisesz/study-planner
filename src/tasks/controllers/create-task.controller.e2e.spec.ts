import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { AppModule } from "../../app.module.js";
import { PrismaService } from "../../database/prisma.service.js";
import { createAuthenticatedUser } from "../../testing/create-authenticated-user.js";

describe("Create Task (E2E)", () => {
    let app: INestApplication;
    let prisma: PrismaService;
    let userId: string;
    let accessToken: string;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

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

    test("[POST] /tasks", async () => {
        const response = await request(app.getHttpServer())
            .post("/tasks")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                title: "Estudar Trigonometria",
                description: "Estudar ângulos notáveis",
                importance: 9,
                domain: 3,
                urgency: 8,
                relevance: 9,
                userId: "cannot-be-injected-by-client",
                resources: [
                    {
                        title: "Aula de Trigonometria",
                        type: "YOUTUBE",
                        url: "https://youtube.com/aula"
                    },
                    { title: "Livro de Matemática", type: "BOOK" }
                ]
            });

        expect(response.statusCode).toBe(201);
        expect(response.body).toMatchObject({
            title: "Estudar Trigonometria",
            score: 82,
            userId
        });
        expect(response.body.resources).toHaveLength(2);

        await expect(
            prisma.task.findUnique({ where: { id: response.body.id } })
        ).resolves.toMatchObject({ userId });
    });

    test("[POST] /tasks rejects unauthenticated requests", async () => {
        const response = await request(app.getHttpServer()).post("/tasks").send({});
        expect(response.statusCode).toBe(401);
    });

    test("[POST] /tasks rejects an invalid token", async () => {
        const response = await request(app.getHttpServer())
            .post("/tasks")
            .set("Authorization", "Bearer invalid-token")
            .send({});
        expect(response.statusCode).toBe(401);
    });
});
