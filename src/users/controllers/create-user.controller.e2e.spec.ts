import type { INestApplication } from '@nestjs/common';
import { compare } from 'bcrypt';
import { randomUUID } from 'node:crypto';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { AppModule } from '../../app.module.js';
import { PrismaService } from '../../database/prisma.service.js';

describe('Create User (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  const emailPrefix = `e2e-users-${randomUUID()}`;

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
    await prisma.user.deleteMany({
      where: { email: { startsWith: emailPrefix } },
    });
    await app.close();
  });

  test('[POST] /users creates a user without exposing the password', async () => {
    const email = `${emailPrefix}-success@example.com`;
    const response = await request(app.getHttpServer()).post('/users').send({
      name: 'Maria Silva',
      email: email.toUpperCase(),
      password: 'password123',
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).toMatchObject({
      name: 'Maria Silva',
      email,
    });
    expect(response.body).not.toHaveProperty('password');
    expect(response.body).not.toHaveProperty('passwordHash');

    const userOnDatabase = await prisma.user.findUnique({ where: { email } });
    expect(userOnDatabase).not.toBeNull();
    expect(userOnDatabase?.passwordHash).not.toBe('password123');
    await expect(
      compare('password123', userOnDatabase!.passwordHash),
    ).resolves.toBe(true);
  });

  test('[POST] /users rejects an existing email', async () => {
    const email = `${emailPrefix}-duplicate@example.com`;
    const payload = {
      name: 'Maria Silva',
      email,
      password: 'password123',
    };

    expect(
      (await request(app.getHttpServer()).post('/users').send(payload))
        .statusCode,
    ).toBe(201);
    expect(
      (await request(app.getHttpServer()).post('/users').send(payload))
        .statusCode,
    ).toBe(409);
  });

  test.each([
    { name: '', email: 'maria@example.com', password: 'password123' },
    { name: 'Maria', email: 'invalid-email', password: 'password123' },
    { name: 'Maria', email: 'maria@example.com', password: 'short' },
  ])('[POST] /users rejects invalid data', async (payload) => {
    const response = await request(app.getHttpServer())
      .post('/users')
      .send(payload);

    expect(response.statusCode).toBe(400);
  });
});
