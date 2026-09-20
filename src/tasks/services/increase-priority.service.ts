import { Injectable, NotFoundException } from '@nestjs/common';
import { TasksRepository } from '../repositories/tasks.repository.js';

@Injectable()
export class IncreasePriorityService {
  constructor(private readonly tasksRepository: TasksRepository) {}

  async execute(userId: string, id: string, percentage: number) {
    const task = await this.tasksRepository.findById(id, userId);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const newScore = Math.min(100, Math.round(task.score * (1 + percentage)));
    await this.tasksRepository.changeScore(id, userId, newScore);

    return { ...task, score: newScore };
  }
}
