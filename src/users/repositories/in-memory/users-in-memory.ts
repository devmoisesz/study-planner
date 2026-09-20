import { randomUUID } from 'node:crypto';
import type { User } from '../../../generated/prisma/client.js';
import type { CreateUserData } from '../../factories/user.factory.js';
import { UsersRepository } from '../users.repository.js';
import type { PublicUser } from '../users.repository.js';

export class UsersInMemory extends UsersRepository {
  public items: User[] = [];

  async create(data: CreateUserData): Promise<PublicUser> {
    const now = new Date();
    const user: User = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      passwordHash: data.passwordHash,
      createdAt: now,
      updatedAt: now,
    };

    this.items.push(user);

    const { passwordHash: _, ...publicUser } = user;
    return publicUser;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.items.find((user) => user.email === email) ?? null;
  }
}
