import type { User } from '../../generated/prisma/client.js';
import type { CreateUserData } from '../factories/user.factory.js';

export type PublicUser = Omit<User, 'passwordHash'>;

export abstract class UsersRepository {
  abstract create(data: CreateUserData): Promise<PublicUser>;
  abstract findByEmail(email: string): Promise<User | null>;
}
