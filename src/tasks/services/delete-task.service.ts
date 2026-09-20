import { Injectable, NotFoundException } from '@nestjs/common';
import { TasksRepository } from '../repositories/tasks.repository.js';

@Injectable()
export class DeleteTaskService {
  constructor(private readonly tasksRepository: TasksRepository) {}

  async execute(userId: string, id: string): Promise<void> {
    const task = await this.tasksRepository.findById(id, userId);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await this.tasksRepository.delete(id, userId);
  }
}
