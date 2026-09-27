import { Body, Controller, HttpCode, Param, Post } from '@nestjs/common';
import { CurrentUser } from '../../auth/decorators/current-user.decorator.js';
import type { JwtPayload } from '../../auth/types/jwt-payload.js';
import { taskIdSchema } from '../../tasks/schemas/task-id.schema.js';
import { ZodValidationPipe } from '../../validation/pipes/zod-validation.pipe.js';
import {
  createResourceSchema,
  type CreateResourceDto,
} from '../schemas/create-resource.schema.js';
import { CreateResourceService } from '../services/create-resource.service.js';

@Controller('/tasks')
export class CreateResourceController {
  constructor(private readonly createResourceService: CreateResourceService) {}

  @Post(':taskId/resources')
  @HttpCode(201)
  async execute(
    @CurrentUser() user: JwtPayload,
    @Param('taskId', new ZodValidationPipe(taskIdSchema)) taskId: string,
    @Body(new ZodValidationPipe(createResourceSchema)) body: CreateResourceDto,
  ) {
    return this.createResourceService.execute(user.sub, taskId, body);
  }
}
