import { ConflictException, Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';
import { UserFactory } from '../factories/user.factory.js';
import { UsersRepository } from '../repositories/users.repository.js';
import type { CreateUserDto } from '../schemas/create-user.schema.js';

@Injectable()
export class CreateUserService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(data: CreateUserDto) {
    const userWithSameEmail = await this.usersRepository.findByEmail(
      data.email,
    );

    if (userWithSameEmail) {
      throw new ConflictException('A user with this email already exists.');
    }

    const passwordHash = await hash(data.password, 10);
    const user = UserFactory.create({
      name: data.name,
      email: data.email,
      passwordHash,
    });

    return this.usersRepository.create(user);
  }
}
