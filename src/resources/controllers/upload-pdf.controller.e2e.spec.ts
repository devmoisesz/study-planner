import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, test, vi } from "vitest";
import { AppModule } from "../../app.module.js";
import { PrismaService } from "../../database/prisma.service.js";
import { FileStorage } from "../../storage/file-storage.js";

describe("Upload PDF (E2E)", () => {
    let app: INestApplication;
    let prisma: PrismaService;
    let taskId: string;
    const fileStorage = {
        uploadPdf: vi.fn().mockResolvedValue({
            url: "https://res.cloudinary.com/study-planner/raw/upload/e2e-material.pdf"
        })
    };

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule]
        })
            .overrideProvider(FileStorage)
            .useValue(fileStorage)
            .compile();

        app = moduleRef.createNestApplication();
        prisma = app.get(PrismaService);

        await app.init();
        await prisma.$connect();

        const task = await prisma.task.create({
            data: {
                title: "E2E - Tarefa para material em PDF",
                score: 64
            }
        });

        taskId = task.id;
    });

    afterAll(async () => {
        await prisma.task.delete({ where: { id: taskId } });
        await app.close();
    });

    test("[POST] /resources/pdf", async () => {
        const pdf = Buffer.from("%PDF-1.7\nE2E PDF content");

        const response = await request(app.getHttpServer())
            .post("/resources/pdf")
            .field("taskId", taskId)
            .field("title", "E2E - Apostila de cálculo")
            .field("description", "Material enviado por upload")
            .attach("file", pdf, {
                filename: "calculo.pdf",
                contentType: "application/pdf"
            });

        expect(response.statusCode).toBe(201);
        expect(response.body).toMatchObject({
            title: "E2E - Apostila de cálculo",
            type: "PDF",
            url: "https://res.cloudinary.com/study-planner/raw/upload/e2e-material.pdf",
            description: "Material enviado por upload",
            taskId
        });
        expect(fileStorage.uploadPdf).toHaveBeenCalledWith({
            buffer: pdf,
            filename: "calculo.pdf"
        });

        const savedResource = await prisma.resource.findUnique({
            where: { id: response.body.id }
        });

        expect(savedResource).toMatchObject({
            title: "E2E - Apostila de cálculo",
            type: "PDF",
            url: "https://res.cloudinary.com/study-planner/raw/upload/e2e-material.pdf",
            taskId
        });
    });
});
