import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { AppModule } from "../../app.module.js";
import { PrismaService } from "../../database/prisma.service.js";
import { createAuthenticatedUser } from "../../testing/create-authenticated-user.js";

describe("List Resources (E2E)", () => {
    let app: INestApplication;
    let prisma: PrismaService;
    let userId: string;
    let accessToken: string;
    let otherUserId: string;
    let ownTaskId: string;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
        app = moduleRef.createNestApplication();
        prisma = app.get(PrismaService);
        await app.init();
        await prisma.$connect();
        ({ user: { id: userId }, accessToken } = await createAuthenticatedUser(app, prisma));
        ({ user: { id: otherUserId } } = await createAuthenticatedUser(app, prisma));

        ownTaskId = (await prisma.task.create({
            data: {
                title: "E2E - Materiais próprios",
                score: 64,
                userId,
                resources: { create: [{ title: "E2E - Livro", type: "BOOK" }] }
            }
        })).id;
        await prisma.task.create({
            data: {
                title: "E2E - Materiais de outra pessoa",
                score: 64,
                userId: otherUserId,
                resources: { create: [{ title: "E2E - Privado", type: "PDF" }] }
            }
        });
    });

    afterAll(async () => {
        await prisma.user.deleteMany({ where: { id: { in: [userId, otherUserId] } } });
        await app.close();
    });

    test("[GET] /resources returns only resources owned by the user", async () => {
        const response = await request(app.getHttpServer())
            .get("/resources")
            .set("Authorization", `Bearer ${accessToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([
            expect.objectContaining({ taskId: ownTaskId, title: "E2E - Livro" })
        ]);
    });
});
