import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import type { JwtModuleOptions, JwtSignOptions } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module.js';
import { CreateSessionController } from './controllers/create-session.controller.js';
import { CreateSessionService } from './services/create-session.service.js';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService): JwtModuleOptions => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.getOrThrow<string>(
            'JWT_EXPIRES_IN',
          ) as JwtSignOptions['expiresIn'],
        },
      }),
    }),
  ],
  controllers: [CreateSessionController],
  providers: [CreateSessionService],
})
export class SessionsModule {}
