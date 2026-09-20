import { Injectable, NotFoundException } from '@nestjs/common';
import { TasksRepository } from '../repositories/tasks.repository.js';

@Injectable()
export class GetTaskService {
  constructor(private readonly tasksRepository: TasksRepository) {}

  async execute(userId: string, id: string) {
    const task = await this.tasksRepository.findDetailsById(id, userId);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }
}
