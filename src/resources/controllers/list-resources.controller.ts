import { Controller, Get, HttpCode } from '@nestjs/common';
import { ListResourcesService } from '../services/list-resources.service.js';
import { CurrentUser } from '../../auth/decorators/current-user.decorator.js';
import type { JwtPayload } from '../../auth/types/jwt-payload.js';

@Controller('/resources')
export class ListResourcesController {
  constructor(private readonly listResourcesService: ListResourcesService) {}

  @Get()
  @HttpCode(200)
  async execute(@CurrentUser() user: JwtPayload) {
    return this.listResourcesService.execute(user.sub);
  }
}
