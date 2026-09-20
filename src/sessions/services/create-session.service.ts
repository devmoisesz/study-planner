import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { UsersRepository } from '../../users/repositories/users.repository.js';
import type { CreateSessionDto } from '../schemas/create-session.schema.js';

@Injectable()
export class CreateSessionService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(data: CreateSessionDto) {
    const user = await this.usersRepository.findByEmail(data.email);

    if (!user || !(await compare(data.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
    });

    return { accessToken };
  }
}
