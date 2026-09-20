import type { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash } from 'bcrypt';
import { randomUUID } from 'node:crypto';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { AppModule } from '../../app.module.js';
import { PrismaService } from '../../database/prisma.service.js';

describe('Create Session (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;
  let userId: string;
  const email = `e2e-session-${randomUUID()}@example.com`;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = app.get(PrismaService);
    jwtService = app.get(JwtService);
    await app.init();
    await prisma.$connect();

    const user = await prisma.user.create({
      data: {
        name: 'Maria Silva',
        email,
        passwordHash: await hash('password123', 10),
      },
    });
    userId = user.id;
  });

  afterAll(async () => {
    await prisma.user.delete({ where: { id: userId } });
    await app.close();
  });

  test('[POST] /sessions returns a valid JWT', async () => {
    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: email.toUpperCase(),
      password: 'password123',
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.accessToken).toEqual(expect.any(String));

    const payload = await jwtService.verifyAsync(response.body.accessToken);
    expect(payload).toMatchObject({ sub: userId, email });
  });

  test('[POST] /sessions rejects an unknown email', async () => {
    const response = await request(app.getHttpServer())
      .post('/sessions')
      .send({
        email: `missing-${randomUUID()}@example.com`,
        password: 'password123',
      });

    expect(response.statusCode).toBe(401);
  });

  test('[POST] /sessions rejects an incorrect password', async () => {
    const response = await request(app.getHttpServer()).post('/sessions').send({
      email,
      password: 'wrong-password',
    });

    expect(response.statusCode).toBe(401);
  });

  test('[POST] /sessions rejects invalid data', async () => {
    const response = await request(app.getHttpServer())
      .post('/sessions')
      .send({ email: 'invalid-email', password: '' });

    expect(response.statusCode).toBe(400);
  });
});
