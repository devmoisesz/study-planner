import { NotFoundException } from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';
import type { TasksRepository } from '../repositories/tasks.repository.js';
import { UpdateTaskService } from './update-task.service.js';

describe('UpdateTaskService', () => {
  const data = { title: 'Revisar química', description: null };

  it('updates only the editable task fields', async () => {
    const tasksRepository = {
      findById: vi.fn().mockResolvedValue({ id: 'task-1' }),
      update: vi.fn().mockResolvedValue({ id: 'task-1', ...data }),
    } as unknown as TasksRepository;
    const sut = new UpdateTaskService(tasksRepository);

    await expect(sut.execute('user-1', 'task-1', data)).resolves.toEqual({
      id: 'task-1',
      ...data,
    });
    expect(tasksRepository.update).toHaveBeenCalledWith('task-1', 'user-1', data);
  });

  it('throws 404 when the task does not exist', async () => {
    const tasksRepository = {
      findById: vi.fn().mockResolvedValue(null),
    } as unknown as TasksRepository;
    const sut = new UpdateTaskService(tasksRepository);

    await expect(sut.execute('user-1', 'missing-task', data)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
