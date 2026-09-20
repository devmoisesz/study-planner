import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ZodValidationPipe } from '../../validation/pipes/zod-validation.pipe.js';
import { createUserSchema } from '../schemas/create-user.schema.js';
import type { CreateUserDto } from '../schemas/create-user.schema.js';
import { CreateUserService } from '../services/create-user.service.js';
import { Public } from '../../auth/decorators/public.decorator.js';

@Controller('/users')
export class CreateUserController {
  constructor(private readonly createUserService: CreateUserService) {}

  @Post()
  @Public()
  @HttpCode(201)
  async execute(
    @Body(new ZodValidationPipe(createUserSchema)) body: CreateUserDto,
  ) {
    return this.createUserService.execute(body);
  }
}
