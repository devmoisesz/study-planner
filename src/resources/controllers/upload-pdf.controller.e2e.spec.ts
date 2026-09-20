import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, test, vi } from "vitest";
import { AppModule } from "../../app.module.js";
import { PrismaService } from "../../database/prisma.service.js";
import { FileStorage } from "../../storage/file-storage.js";
import { createAuthenticatedUser } from "../../testing/create-authenticated-user.js";

describe("Upload PDF (E2E)", () => {
    let app: INestApplication;
    let prisma: PrismaService;
    let taskId: string;
    let userId: string;
    let accessToken: string;
    let otherUserId: string;
    let otherAccessToken: string;
    const fileStorage = {
        uploadPdf: vi.fn().mockResolvedValue({ url: "https://example.com/material.pdf" })
    };

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
            .overrideProvider(FileStorage)
            .useValue(fileStorage)
            .compile();
        app = moduleRef.createNestApplication();
        prisma = app.get(PrismaService);
        await app.init();
        await prisma.$connect();
        ({ user: { id: userId }, accessToken } = await createAuthenticatedUser(app, prisma));
        ({ user: { id: otherUserId }, accessToken: otherAccessToken } =
            await createAuthenticatedUser(app, prisma));
        taskId = (await prisma.task.create({
            data: { title: "E2E - Tarefa para PDF", score: 64, userId }
        })).id;
    });

    afterAll(async () => {
        await prisma.user.deleteMany({ where: { id: { in: [userId, otherUserId] } } });
        await app.close();
    });

    function upload(token: string) {
        return request(app.getHttpServer())
            .post("/resources/pdf")
            .set("Authorization", `Bearer ${token}`)
            .field("taskId", taskId)
            .field("title", "E2E - Apostila")
            .attach("file", Buffer.from("%PDF-1.7\ncontent"), {
                filename: "material.pdf",
                contentType: "application/pdf"
            });
    }

    test("[POST] /resources/pdf", async () => {
        const response = await upload(accessToken);
        expect(response.statusCode).toBe(201);
        expect(response.body).toMatchObject({ taskId, type: "PDF" });
    });

    test("[POST] /resources/pdf rejects another user's task", async () => {
        const response = await upload(otherAccessToken);
        expect(response.statusCode).toBe(404);
    });
});
