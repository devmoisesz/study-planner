import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service.js';
import type { CreateTaskData } from '../../factories/task.factory.js';
import { TasksRepository } from '../tasks.repository.js';
import type { TaskDetails } from '../tasks.repository.js';
import type { UpdateTaskData } from '../tasks.repository.js';
import { Task } from '../../../generated/prisma/client.js';

@Injectable()
export class PrismaTasksRepository extends TasksRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async changeScore(
    id: string,
    userId: string,
    newScore: number,
  ): Promise<void> {
    await this.prisma.task.update({
      where: {
        id,
        userId,
      },
      data: {
        score: newScore,
      },
    });
  }

  async listTasks(userId: string): Promise<Task[]> {
    return await this.prisma.task.findMany({
      where: { userId },
      orderBy: {
        score: 'desc',
      },
      include: {
        resources: true,
        _count: {
          select: {
            resources: true,
          },
        },
      },
    });
  }

  async findById(id: string, userId: string): Promise<Task | null> {
    return this.prisma.task.findFirst({ where: { id, userId } });
  }

  async findDetailsById(
    id: string,
    userId: string,
  ): Promise<TaskDetails | null> {
    return this.prisma.task.findFirst({
      where: { id, userId },
      include: {
        resources: true,
        productivities: { orderBy: { createdAt: 'desc' } },
      },
    });
  }

  async delete(id: string, userId: string): Promise<void> {
    // Resources e productivities saem junto: onDelete Cascade no schema.
    await this.prisma.task.delete({ where: { id, userId } });
  }

  async update(
    id: string,
    userId: string,
    data: UpdateTaskData,
  ): Promise<Task> {
    return this.prisma.task.update({ where: { id, userId }, data });
  }

  async create(data: CreateTaskData) {
    const { resources, ...task } = data;

    return this.prisma.task.create({
      data: {
        ...task,
        resources: resources?.length ? { create: resources } : undefined,
      },
      include: { resources: true },
    });
  }
}
