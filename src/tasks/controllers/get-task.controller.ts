import { Controller, Get, HttpCode, Param } from '@nestjs/common';
import { ZodValidationPipe } from '../../validation/pipes/zod-validation.pipe.js';
import { taskIdSchema } from '../schemas/task-id.schema.js';
import { GetTaskService } from '../services/get-task.service.js';
import { CurrentUser } from '../../auth/decorators/current-user.decorator.js';
import type { JwtPayload } from '../../auth/types/jwt-payload.js';

@Controller('/tasks')
export class GetTaskController {
  constructor(private readonly getTaskService: GetTaskService) {}

  @Get(':id')
  @HttpCode(200)
  async execute(
    @CurrentUser() user: JwtPayload,
    @Param('id', new ZodValidationPipe(taskIdSchema)) id: string,
  ) {
    return this.getTaskService.execute(user.sub, id);
  }
}
