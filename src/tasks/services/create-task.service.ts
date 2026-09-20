import { Injectable } from '@nestjs/common';
import { TaskFactory } from '../factories/task.factory.js';
import { calculateInitialTaskScore } from '././utils/calculate-initial-task-score.js';
import { TasksRepository } from '../repositories/tasks.repository.js';
import { CreateTaskDto } from '../schemas/create-task.schema.js';

@Injectable()
export class CreateTaskService {
  constructor(private readonly tasksRepository: TasksRepository) {}

  async execute(userId: string, data: CreateTaskDto) {
    const score = calculateInitialTaskScore(data);

    const task = TaskFactory.create({
      userId,
      title: data.title,
      description: data.description,
      score,
      resources: data.resources,
    });

    return this.tasksRepository.create(task);
  }
}
