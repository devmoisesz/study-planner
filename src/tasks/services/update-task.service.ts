import { Injectable, NotFoundException } from '@nestjs/common';
import { TasksRepository } from '../repositories/tasks.repository.js';
import type { UpdateTaskDto } from '../schemas/update-task.schema.js';

@Injectable()
export class UpdateTaskService {
  constructor(private readonly tasksRepository: TasksRepository) {}

  async execute(userId: string, id: string, data: UpdateTaskDto) {
    const task = await this.tasksRepository.findById(id, userId);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return this.tasksRepository.update(id, userId, data);
  }
}
