import { Injectable, NotFoundException } from '@nestjs/common';
import { TasksRepository } from '../repositories/tasks.repository.js';
import { ProductivityRepository } from '../repositories/productivity.repository.js';

@Injectable()
export class LogProductivityService {
  constructor(
    private readonly tasksRepository: TasksRepository,
    private readonly productivityRepository: ProductivityRepository,
  ) {}

  async execute(userId: string, id: string, percentage: number) {
    const task = await this.tasksRepository.findById(id, userId);

    if (!task) {
      throw new NotFoundException('Task Not Found');
    }

    const newScore = Math.round(task.score * (1 - percentage));

    await this.tasksRepository.changeScore(id, userId, newScore);

    const formattedPercentage = Math.round(percentage * 100);

    return await this.productivityRepository.create({
      taskId: id,
      percentage: formattedPercentage,
    });
  }
}
