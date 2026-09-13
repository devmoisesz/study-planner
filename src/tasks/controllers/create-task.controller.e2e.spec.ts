import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { AppModule } from '../../app.module.js';
import { PrismaService } from '../../database/prisma.service.js';

describe('Create Task (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let createdTaskId: string | undefined;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = app.get(PrismaService);

    await app.init();
    await prisma.$connect();
  });

  afterAll(async () => {
    if (createdTaskId) {
      await prisma.task.delete({ where: { id: createdTaskId } });
    }

    await app.close();
  });

  test('[POST] /tasks', async () => {
    const response = await request(app.getHttpServer())
      .post('/tasks')
      .send({
        title: 'Estudar Trigonometria',
        description: 'Estudar ângulos notáveis',
        importance: 9,
        domain: 3,
        urgency: 8,
        relevance: 9,
        resources: [
          {
            title: 'Aula de Trigonometria',
            type: 'YOUTUBE',
            url: 'https://youtube.com/aula',
            description: 'Aula sobre ângulos notáveis',
          },
          {
            title: 'Livro de Matemática',
            type: 'BOOK',
            description: 'Capítulo 8, páginas 184–193',
          },
        ],
      });

    expect(response.statusCode).toBe(201);

    expect(response.body).toMatchObject({
      title: 'Estudar Trigonometria',
      description: 'Estudar ângulos notáveis',
      score: 82,
    });
    expect(response.body.resources).toHaveLength(2);

    createdTaskId = response.body.id;

    const taskOnDatabase = await prisma.task.findUnique({
      where: { id: createdTaskId },
      include: { resources: true },
    });

    expect(taskOnDatabase).toMatchObject({
      id: createdTaskId,
      title: 'Estudar Trigonometria',
      score: 82,
    });
    expect(taskOnDatabase?.resources).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: 'Aula de Trigonometria',
          type: 'YOUTUBE',
        }),
        expect.objectContaining({
          title: 'Livro de Matemática',
          type: 'BOOK',
        }),
      ]),
    );
  });
});
