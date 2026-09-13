import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../database/prisma.service.js";
import type { CreateTaskData } from "../../factories/task.factory.js";
import { TasksRepository } from "../tasks.repository.js";
import type { TaskDetails } from "../tasks.repository.js";
import { Task } from "../../../generated/prisma/client.js";

@Injectable()
export class PrismaTasksRepository extends TasksRepository {
    constructor(private readonly prisma: PrismaService) {
        super();
    }

    async changeScore(id: string, newScore: number): Promise<void> {
        await this.prisma.task.update({
            where: {
                id
            },
            data: {
                score: newScore
            }
        })
    }
    

    async listTasks(): Promise<Task[]> {
        return await this.prisma.task.findMany({
            orderBy: {
                score: 'desc'
            },
            include: {
                resources: true,
                _count: {
                    select: {
                        resources: true
                    }
                }
            }
        });
    }

    async findById(id: string): Promise<Task | null> {
        return this.prisma.task.findUnique({ where: { id } });
    }

    async findDetailsById(id: string): Promise<TaskDetails | null> {
        return this.prisma.task.findUnique({
            where: { id },
            include: {
                resources: true,
                productivities: { orderBy: { createdAt: "desc" } }
            }
        });
    }

    async delete(id: string): Promise<void> {
        // Resources e productivities saem junto: onDelete Cascade no schema.
        await this.prisma.task.delete({ where: { id } });
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
