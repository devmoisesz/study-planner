import { randomUUID } from 'node:crypto';
import type { CreateTaskData } from '../../factories/task.factory.js';
import { TasksRepository } from '../tasks.repository.js';
import type {
  CreatedTask,
  TaskDetails,
  UpdateTaskData,
} from '../tasks.repository.js';
import { Task } from '../../../generated/prisma/client.js';

export class TasksInMemory extends TasksRepository {
  public items: CreatedTask[] = [];

  async changeScore(
    id: string,
    userId: string,
    newScore: number,
  ): Promise<void | null> {
    const task = await this.items.find(
      (task) => task.id === id && task.userId === userId,
    );

    if (!task) {
      return null;
    }

    task.score = newScore;
  }

  async listTasks(userId: string): Promise<Task[]> {
    return [...this.items]
      .filter((task) => task.userId === userId)
      .sort((firstTask, secondTask) => secondTask.score - firstTask.score)
      .map(({ resources, ...task }) => ({
        ...task,
        resourceCount: resources.length,
      }));
  }

  async findById(id: string, userId: string): Promise<Task | null> {
    return (
      this.items.find((task) => task.id === id && task.userId === userId) ??
      null
    );
  }

  async findDetailsById(
    id: string,
    userId: string,
  ): Promise<TaskDetails | null> {
    const task = this.items.find(
      (item) => item.id === id && item.userId === userId,
    );

    return task ? { ...task, productivities: [] } : null;
  }

  async delete(id: string, userId: string): Promise<void> {
    this.items = this.items.filter(
      (task) => task.id !== id || task.userId !== userId,
    );
  }

  async update(
    id: string,
    userId: string,
    data: UpdateTaskData,
  ): Promise<Task> {
    const task = this.items.find(
      (item) => item.id === id && item.userId === userId,
    );

    if (!task) {
      throw new Error('Task not found');
    }

    task.title = data.title;
    task.description = data.description;
    task.updatedAt = new Date();
    return task;
  }

  async create(data: CreateTaskData): Promise<CreatedTask> {
    const taskId = randomUUID();
    const createdAt = new Date();
    const task: CreatedTask = {
      id: taskId,
      userId: data.userId,
      title: data.title,
      description: data.description ?? null,
      score: data.score,
      resources: (data.resources ?? []).map((resource) => ({
        id: randomUUID(),
        title: resource.title,
        type: resource.type,
        url: resource.url ?? null,
        description: resource.description ?? null,
        taskId,
        createdAt,
      })),
      createdAt,
      updatedAt: createdAt,
    };

    this.items.push(task);

    return task;
  }
}
