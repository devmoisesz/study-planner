import { NotFoundException } from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';
import type { TasksRepository } from '../repositories/tasks.repository.js';
import { IncreasePriorityService } from './increase-priority.service.js';

describe('IncreasePriorityService', () => {
  it('increases the score by the supplied ratio', async () => {
    const tasksRepository = {
      findById: vi.fn().mockResolvedValue({ id: 'task-1', score: 39 }),
      changeScore: vi.fn(),
    } as unknown as TasksRepository;
    const sut = new IncreasePriorityService(tasksRepository);

    await expect(sut.execute('user-1', 'task-1', 0.5)).resolves.toEqual({
      id: 'task-1',
      score: 59,
    });
    expect(tasksRepository.changeScore).toHaveBeenCalledWith('task-1', 'user-1', 59);
  });

  it('caps the score at 100', async () => {
    const tasksRepository = {
      findById: vi.fn().mockResolvedValue({ id: 'task-1', score: 81 }),
      changeScore: vi.fn(),
    } as unknown as TasksRepository;
    const sut = new IncreasePriorityService(tasksRepository);

    await expect(sut.execute('user-1', 'task-1', 0.9)).resolves.toEqual({
      id: 'task-1',
      score: 100,
    });
  });

  it('throws 404 when the task does not exist', async () => {
    const tasksRepository = {
      findById: vi.fn().mockResolvedValue(null),
    } as unknown as TasksRepository;
    const sut = new IncreasePriorityService(tasksRepository);

    await expect(sut.execute('user-1', 'missing-task', 0.5)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
