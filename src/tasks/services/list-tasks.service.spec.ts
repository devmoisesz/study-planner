import { describe, expect, it, vi } from 'vitest';
import type { TasksRepository } from '../repositories/tasks.repository.js';
import { ListTasksService } from './list-tasks.service.js';

describe('List Tasks Service', () => {
  it('should return the tasks provided by the repository', async () => {
    const tasks = [{ id: 'task-1', title: 'Estudar Trigonometria' }];
    const tasksRepository = {
      listTasks: vi.fn().mockResolvedValue(tasks),
    } as unknown as TasksRepository;
    const sut = new ListTasksService(tasksRepository);

    const result = await sut.execute();

    expect(result).toEqual(tasks);
    expect(tasksRepository.listTasks).toHaveBeenCalledOnce();
  });
});
