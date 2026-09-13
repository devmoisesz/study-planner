import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../database/prisma.service.js";
import type { CreateTaskData } from "../../factories/task.factory.js";
import { TasksRepository } from "../tasks.repository.js";
import { Task } from "../../../generated/prisma/client.js";

@Injectable()
export class PrismaTasksRepository extends TasksRepository {
    constructor(private readonly prisma: PrismaService) {
        super();
    }

    async listTasks(): Promise<Task[]> {
        return await this.prisma.task.findMany({
            orderBy: {
                score: 'desc'
            }
        })
    }

    async create(data: CreateTaskData) {
        const { resources, ...task } = data;

        return this.prisma.task.create({
            data: {
                ...task,
                resources: resources?.length
                    ? { create: resources }
                    : undefined
            },
            include: { resources: true }
        });
    }
}
