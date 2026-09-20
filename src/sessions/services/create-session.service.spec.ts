import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash } from 'bcrypt';
import { beforeEach, describe, expect, it } from 'vitest';
import { UsersInMemory } from '../../users/repositories/in-memory/users-in-memory.js';
import { CreateSessionService } from './create-session.service.js';

let usersRepository: UsersInMemory;
let jwtService: JwtService;
let sut: CreateSessionService;

describe('Create Session Service', () => {
  beforeEach(() => {
    usersRepository = new UsersInMemory();
    jwtService = new JwtService({
      secret: 'unit-test-secret',
      signOptions: { expiresIn: '15m' },
    });
    sut = new CreateSessionService(usersRepository, jwtService);
  });

  it('authenticates a user and returns a JWT', async () => {
    const user = await usersRepository.create({
      name: 'Maria Silva',
      email: 'maria@example.com',
      passwordHash: await hash('password123', 10),
    });

    const result = await sut.execute({
      email: 'maria@example.com',
      password: 'password123',
    });
    const payload = await jwtService.verifyAsync(result.accessToken);

    expect(result.accessToken).toEqual(expect.any(String));
    expect(payload).toMatchObject({
      sub: user.id,
      email: user.email,
    });
  });

  it('rejects an email that is not registered', async () => {
    await expect(
      sut.execute({
        email: 'missing@example.com',
        password: 'password123',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('rejects an incorrect password', async () => {
    await usersRepository.create({
      name: 'Maria Silva',
      email: 'maria@example.com',
      passwordHash: await hash('password123', 10),
    });

    await expect(
      sut.execute({
        email: 'maria@example.com',
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
