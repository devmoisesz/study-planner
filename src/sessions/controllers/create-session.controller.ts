import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ZodValidationPipe } from '../../validation/pipes/zod-validation.pipe.js';
import { createSessionSchema } from '../schemas/create-session.schema.js';
import type { CreateSessionDto } from '../schemas/create-session.schema.js';
import { CreateSessionService } from '../services/create-session.service.js';

@Controller('/sessions')
export class CreateSessionController {
  constructor(private readonly createSessionService: CreateSessionService) {}

  @Post()
  @HttpCode(200)
  async execute(
    @Body(new ZodValidationPipe(createSessionSchema)) body: CreateSessionDto,
  ) {
    return this.createSessionService.execute(body);
  }
}
