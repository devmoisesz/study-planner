import { Controller, Delete, HttpCode, Param } from '@nestjs/common';
import { taskIdSchema } from '../schemas/task-id.schema.js';
import { DeleteTaskService } from '../services/delete-task.service.js';
import { ZodValidationPipe } from '../../validation/pipes/zod-validation.pipe.js';
import { CurrentUser } from '../../auth/decorators/current-user.decorator.js';
import type { JwtPayload } from '../../auth/types/jwt-payload.js';

@Controller('tasks')
export class DeleteTaskController {
  constructor(private readonly deleteTaskService: DeleteTaskService) {}

  @Delete(':id')
  @HttpCode(204)
  async execute(
    @CurrentUser() user: JwtPayload,
    @Param('id', new ZodValidationPipe(taskIdSchema)) id: string,
  ) {
    return this.deleteTaskService.execute(user.sub, id);
  }
}
