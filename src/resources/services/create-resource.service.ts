import { Injectable, NotFoundException } from '@nestjs/common';
import { ResourceFactory } from '../../tasks/factories/resource.factory.js';
import { TasksRepository } from '../../tasks/repositories/tasks.repository.js';
import { ResourcesRepository } from '../repositories/resources.repository.js';
import type { CreateResourceDto } from '../schemas/create-resource.schema.js';

@Injectable()
export class CreateResourceService {
  constructor(
    private readonly resourcesRepository: ResourcesRepository,
    private readonly tasksRepository: TasksRepository,
  ) {}

  async execute(userId: string, taskId: string, data: CreateResourceDto) {
    const task = await this.tasksRepository.findById(taskId, userId);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return this.resourcesRepository.create({
      ...ResourceFactory.create(data),
      taskId: task.id,
    });
  }
}
