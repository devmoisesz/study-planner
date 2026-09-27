import { beforeEach, describe, expect, it } from 'vitest';
import { TasksInMemory } from '../../tasks/repositories/in-memory/tasks-in-memory.js';
import { ResourcesInMemory } from '../repositories/in-memory/resources-in-memory.js';
import { CreateResourceService } from './create-resource.service.js';

describe('Create Resource Service', () => {
  const userId = 'user-1';
  let tasksRepository: TasksInMemory;
  let resourcesRepository: ResourcesInMemory;
  let sut: CreateResourceService;
  let taskId: string;

  beforeEach(async () => {
    tasksRepository = new TasksInMemory();
    resourcesRepository = new ResourcesInMemory();
    sut = new CreateResourceService(resourcesRepository, tasksRepository);
    const task = await tasksRepository.create({
      userId,
      title: 'Study programming',
      score: 50,
    });
    taskId = task.id;
  });

  it('creates a resource associated with an existing task', async () => {
    const data = {
      title: 'Programming lesson',
      type: 'YOUTUBE' as const,
      url: 'https://youtube.com/watch?v=lesson',
      description: 'Conditionals and loops',
    };

    const result = await sut.execute(userId, taskId, data);

    expect(result).toMatchObject({ ...data, taskId });
    expect(result.id).toEqual(expect.any(String));
    expect(resourcesRepository.items).toEqual([result]);
    expect(tasksRepository.items[0].score).toBe(50);
  });

  it.each(['YOUTUBE', 'BOOK', 'PDF', 'WEBSITE', 'OTHER'] as const)(
    'creates a %s resource without optional fields',
    async (type) => {
      const result = await sut.execute(userId, taskId, {
        title: 'Study material',
        type,
      });

      expect(result).toMatchObject({
        taskId,
        type,
        url: null,
        description: null,
      });
      expect(resourcesRepository.items).toEqual([result]);
    },
  );

  it('does not persist a resource when the task does not exist', async () => {
    await expect(
      sut.execute(userId, 'missing-task', { title: 'Book', type: 'BOOK' }),
    ).rejects.toMatchObject({ status: 404 });

    expect(resourcesRepository.items).toEqual([]);
  });

  it("does not persist a resource in another user's task", async () => {
    await expect(
      sut.execute('user-2', taskId, { title: 'Book', type: 'BOOK' }),
    ).rejects.toMatchObject({ status: 404 });

    expect(resourcesRepository.items).toEqual([]);
  });
});
