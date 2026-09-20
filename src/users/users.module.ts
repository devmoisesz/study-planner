import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module.js';
import { CreateUserController } from './controllers/create-user.controller.js';
import { PrismaUsersRepository } from './repositories/prisma/prisma-users.repository.js';
import { UsersRepository } from './repositories/users.repository.js';
import { CreateUserService } from './services/create-user.service.js';

@Module({
  imports: [DatabaseModule],
  controllers: [CreateUserController],
  providers: [
    CreateUserService,
    PrismaUsersRepository,
    {
      provide: UsersRepository,
      useExisting: PrismaUsersRepository,
    },
  ],
  exports: [UsersRepository],
})
export class UsersModule {}
