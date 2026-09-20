import { compare } from 'bcrypt';
import { ConflictException } from '@nestjs/common';
import { beforeEach, describe, expect, it } from 'vitest';
import { UsersInMemory } from '../repositories/in-memory/users-in-memory.js';
import { CreateUserService } from './create-user.service.js';

let usersRepository: UsersInMemory;
let sut: CreateUserService;

describe('Create User Service', () => {
  beforeEach(() => {
    usersRepository = new UsersInMemory();
    sut = new CreateUserService(usersRepository);
  });

  it('creates a user with a hashed password', async () => {
    const result = await sut.execute({
      name: 'Maria Silva',
      email: 'maria@example.com',
      password: 'password123',
    });

    expect(result).toMatchObject({
      name: 'Maria Silva',
      email: 'maria@example.com',
    });
    expect(usersRepository.items).toHaveLength(1);
    expect(usersRepository.items[0].passwordHash).not.toBe('password123');
    await expect(
      compare('password123', usersRepository.items[0].passwordHash),
    ).resolves.toBe(true);
  });

  it('rejects an email that is already registered', async () => {
    await sut.execute({
      name: 'Maria Silva',
      email: 'maria@example.com',
      password: 'password123',
    });

    await expect(
      sut.execute({
        name: 'Outra Maria',
        email: 'maria@example.com',
        password: 'another-password',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(usersRepository.items).toHaveLength(1);
  });

  it('never returns the password or password hash', async () => {
    const result = await sut.execute({
      name: 'Maria Silva',
      email: 'maria@example.com',
      password: 'password123',
    });

    expect(result).not.toHaveProperty('password');
    expect(result).not.toHaveProperty('passwordHash');
  });
});
