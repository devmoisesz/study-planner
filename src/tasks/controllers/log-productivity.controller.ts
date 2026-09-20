import { Body, Controller, HttpCode, Param, Post } from '@nestjs/common';
import { ZodValidationPipe } from '../../validation/pipes/zod-validation.pipe.js';
import { LogProductivityService } from '../services/log-productivity.service.js';
import {
  logProductivitySchema,
  type LogProductivityDto,
} from '../schemas/log-productivity.schema.js';
import { taskIdSchema } from '../schemas/task-id.schema.js';
import { CurrentUser } from '../../auth/decorators/current-user.decorator.js';
import type { JwtPayload } from '../../auth/types/jwt-payload.js';

@Controller('/tasks/:id/productivities')
export class LogProductivityController {
  constructor(
    private readonly logProductivityService: LogProductivityService,
  ) {}

  @Post()
  @HttpCode(201)
  async execute(
    @CurrentUser() user: JwtPayload,
    @Param('id', new ZodValidationPipe(taskIdSchema)) id: string,
    @Body(new ZodValidationPipe(logProductivitySchema))
    body: LogProductivityDto,
  ) {
    return this.logProductivityService.execute(user.sub, id, body.percentage);
  }
}
