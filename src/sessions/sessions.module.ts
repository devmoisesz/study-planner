import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module.js';
import { CreateSessionController } from './controllers/create-session.controller.js';
import { CreateSessionService } from './services/create-session.service.js';

@Module({
  imports: [UsersModule],
  controllers: [CreateSessionController],
  providers: [CreateSessionService],
})
export class SessionsModule {}
