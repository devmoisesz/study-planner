import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import {
  type CreateTaskDto,
  createTaskSchema,
} from '../schemas/create-task.schema.js';
import { CreateTaskService } from '../services/create-task.service.js';
import { ZodValidationPipe } from '../../validation/pipes/zod-validation.pipe.js';
import { CurrentUser } from '../../auth/decorators/current-user.decorator.js';
import type { JwtPayload } from '../../auth/types/jwt-payload.js';

@Controller('/tasks')
export class CreateTaskController {
  constructor(private readonly createTaskService: CreateTaskService) {}

  @Post()
  @HttpCode(201)
  async execute(
    @CurrentUser() user: JwtPayload,
    @Body(new ZodValidationPipe(createTaskSchema)) body: CreateTaskDto,
  ) {
    return this.createTaskService.execute(user.sub, body);
  }
}
