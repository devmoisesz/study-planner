import { Controller, Get, HttpCode } from '@nestjs/common';
import { ListTasksService } from '../services/list-tasks.service.js';
import { CurrentUser } from '../../auth/decorators/current-user.decorator.js';
import type { JwtPayload } from '../../auth/types/jwt-payload.js';

@Controller('tasks/list')
export class ListTasksController {
  constructor(private readonly listTasksService: ListTasksService) {}

  @Get()
  @HttpCode(200)
  async execute(@CurrentUser() user: JwtPayload) {
    return this.listTasksService.execute(user.sub);
  }
}
