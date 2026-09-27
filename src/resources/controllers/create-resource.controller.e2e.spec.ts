import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { randomUUID } from 'node:crypto';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { AppModule } from '../../app.module.js';
import { PrismaService } from '../../database/prisma.service.js';
import { createAuthenticatedUser } from '../../testing/create-authenticated-user.js';

describe('Create Resource (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let taskId: string;
  let existingResourceId: string;
  let accessToken: string;
  let otherAccessToken: string;
  let userId: string;
  const userIds: string[] = [];
  const body = {
    title: 'Programming lesson',
    type: 'YOUTUBE',
    url: 'https://youtube.com/watch?v=lesson',
    description: 'Conditionals and loops',
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    prisma = app.get(PrismaService);
    await app.init();
    await prisma.$connect();

    const owner = await createAuthenticatedUser(app, prisma);
    userId = owner.user.id;
    accessToken = owner.accessToken;
    userIds.push(userId);
    const other = await createAuthenticatedUser(app, prisma);
    otherAccessToken = other.accessToken;
    userIds.push(other.user.id);

    const task = await prisma.task.create({
      data: {
        title: 'E2E - Existing task',
        score: 50,
        userId,
        resources: { create: { title: 'Existing book', type: 'BOOK' } },
      },
      include: { resources: true },
    });
    taskId = task.id;
    existingResourceId = task.resources[0].id;
  });

  afterAll(async () => {
    try {
      if (prisma && userIds.length) {
        await prisma.user.deleteMany({ where: { id: { in: userIds } } });
      }
    } finally {
      await app?.close();
    }
  });

  test('creates and persists a resource without replacing existing resources', async () => {
    const response = await request(app.getHttpServer())
      .post(`/tasks/${taskId}/resources`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(body);

    expect(response.statusCode).toBe(201);
    expect(response.body).toMatchObject({ ...body, taskId });
    expect(response.body.id).toEqual(expect.any(String));
    expect(
      await prisma.resource.findUnique({ where: { id: response.body.id } }),
    ).toMatchObject({ ...body, taskId });
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { resources: true },
    });
    expect(task).toMatchObject({
      title: 'E2E - Existing task',
      score: 50,
      userId,
    });
    expect(task?.resources).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: existingResourceId }),
        expect.objectContaining({ id: response.body.id }),
      ]),
    );
  });

  test.each(['YOUTUBE', 'BOOK', 'PDF', 'WEBSITE', 'OTHER'])(
    'creates a %s resource without optional fields',
    async (type) => {
      const response = await request(app.getHttpServer())
        .post(`/tasks/${taskId}/resources`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ title: 'Material', type });

      expect(response.statusCode).toBe(201);
      expect(response.body).toMatchObject({
        taskId,
        title: 'Material',
        type,
        url: null,
        description: null,
      });
    },
  );

  test('rejects a request without authentication', async () => {
    const count = await prisma.resource.count({ where: { taskId } });
    const response = await request(app.getHttpServer())
      .post(`/tasks/${taskId}/resources`)
      .send(body);

    expect(response.statusCode).toBe(401);
    expect(await prisma.resource.count({ where: { taskId } })).toBe(count);
  });

  test('rejects an invalid token', async () => {
    const response = await request(app.getHttpServer())
      .post(`/tasks/${taskId}/resources`)
      .set('Authorization', 'Bearer invalid-token')
      .send(body);

    expect(response.statusCode).toBe(401);
  });

  test('rejects a nonexistent task', async () => {
    const missingTaskId = randomUUID();
    const response = await request(app.getHttpServer())
      .post(`/tasks/${missingTaskId}/resources`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(body);

    expect(response.statusCode).toBe(404);
    expect(
      await prisma.resource.count({ where: { taskId: missingTaskId } }),
    ).toBe(0);
  });

  test("rejects another user's task without persisting a resource", async () => {
    const count = await prisma.resource.count({ where: { taskId } });
    const response = await request(app.getHttpServer())
      .post(`/tasks/${taskId}/resources`)
      .set('Authorization', `Bearer ${otherAccessToken}`)
      .send(body);

    expect(response.statusCode).toBe(404);
    expect(await prisma.resource.count({ where: { taskId } })).toBe(count);
  });

  test.each([
    ['invalid resource type', { ...body, type: 'INVALID' }],
    ['empty body', {}],
    ['missing title', { type: 'BOOK' }],
    ['missing type', { title: 'Book' }],
    ['blank title', { ...body, title: '   ' }],
    ['invalid URL', { ...body, url: 'invalid-url' }],
    ['invalid description', { ...body, description: 123 }],
  ])('rejects %s', async (_label, invalidBody) => {
    const count = await prisma.resource.count({ where: { taskId } });
    const response = await request(app.getHttpServer())
      .post(`/tasks/${taskId}/resources`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(invalidBody);

    expect(response.statusCode).toBe(400);
    expect(await prisma.resource.count({ where: { taskId } })).toBe(count);
  });

  test('rejects an attempt to supply the owner userId in the body', async () => {
    const count = await prisma.resource.count({ where: { taskId } });
    const response = await request(app.getHttpServer())
      .post(`/tasks/${taskId}/resources`)
      .set('Authorization', `Bearer ${otherAccessToken}`)
      .send({ ...body, userId });

    expect(response.statusCode).toBe(400);
    expect(await prisma.resource.count({ where: { taskId } })).toBe(count);
  });

  test('rejects an invalid taskId', async () => {
    const response = await request(app.getHttpServer())
      .post('/tasks/not-a-uuid/resources')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(body);

    expect(response.statusCode).toBe(400);
  });
});
