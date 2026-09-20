import { Injectable } from '@nestjs/common';
import { TasksRepository } from '../repositories/tasks.repository.js';

@Injectable()
export class ListTasksService {
  constructor(private readonly tasksRepository: TasksRepository) {}

  async execute(userId: string) {
    return this.tasksRepository.listTasks(userId);
  }
}
