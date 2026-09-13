import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { AppModule } from "../../app.module.js";
import { PrismaService } from "../../database/prisma.service.js";

describe("List Resources (E2E)", () => {
    let app: INestApplication;
    let prisma: PrismaService;
    let createdTaskId: string;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        app = moduleRef.createNestApplication();
        prisma = app.get(PrismaService);

        await app.init();
        await prisma.$connect();

        const task = await prisma.task.create({
            data: {
                title: "E2E - Tarefa com materiais",
                score: 64,
                resources: {
                    create: [
                        {
                            title: "E2E - Aula no YouTube",
                            type: "YOUTUBE",
                            url: "https://youtube.com/e2e"
                        },
                        {
                            title: "E2E - Livro",
                            type: "BOOK",
                            description: "Capítulo 8"
                        }
                    ]
                }
            }
        });

        createdTaskId = task.id;
    });

    afterAll(async () => {
        await prisma.task.delete({ where: { id: createdTaskId } });
        await app.close();
    });

    test("[GET] /resources", async () => {
        const response = await request(app.getHttpServer()).get("/resources");

        expect(response.statusCode).toBe(200);

        const created = response.body.filter(
            (resource: { taskId: string }) => resource.taskId === createdTaskId
        );

        expect(created).toHaveLength(2);
        expect(created).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    title: "E2E - Aula no YouTube",
                    type: "YOUTUBE",
                    url: "https://youtube.com/e2e",
                    taskTitle: "E2E - Tarefa com materiais"
                }),
                expect.objectContaining({
                    title: "E2E - Livro",
                    type: "BOOK",
                    url: null,
                    taskTitle: "E2E - Tarefa com materiais"
                })
            ])
        );
    });
});
