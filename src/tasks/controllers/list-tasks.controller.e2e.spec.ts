import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { AppModule } from "../../app.module.js";
import { PrismaService } from "../../database/prisma.service.js";

describe("List Tasks (E2E)", () => {
    let app: INestApplication;
    let prisma: PrismaService;
    const createdTaskIds: string[] = [];

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        app = moduleRef.createNestApplication();
        prisma = app.get(PrismaService);

        await app.init();
        await prisma.$connect();

        const tasks = await Promise.all([
            prisma.task.create({
                data: { title: "E2E - Prioridade baixa", score: 20 }
            }),
            prisma.task.create({
                data: {
                    title: "E2E - Prioridade alta",
                    score: 90,
                    resources: {
                        create: [
                            { title: "E2E - Material 1", type: "WEBSITE" },
                            { title: "E2E - Material 2", type: "PDF" }
                        ]
                    }
                }
            }),
            prisma.task.create({
                data: { title: "E2E - Prioridade média", score: 50 }
            })
        ]);

        createdTaskIds.push(...tasks.map((task) => task.id));
    });

    afterAll(async () => {
        await prisma.task.deleteMany({
            where: { id: { in: createdTaskIds } }
        });
        await app.close();
    });

    test("[GET] /tasks/list", async () => {
        const response = await request(app.getHttpServer()).get("/tasks/list");

        expect(response.statusCode).toBe(200);

        const createdTasks = response.body.filter((task: { id: string }) =>
            createdTaskIds.includes(task.id)
        );

        expect(createdTasks).toEqual([
            expect.objectContaining({
                title: "E2E - Prioridade alta",
                score: 90,
                resourceCount: 2
            }),
            expect.objectContaining({
                title: "E2E - Prioridade média",
                score: 50,
                resourceCount: 0
            }),
            expect.objectContaining({
                title: "E2E - Prioridade baixa",
                score: 20,
                resourceCount: 0
            })
        ]);

        // O list conta os recursos sem carregar nenhum deles no payload.
        expect(createdTasks[0]).not.toHaveProperty("resources");
    });
});
