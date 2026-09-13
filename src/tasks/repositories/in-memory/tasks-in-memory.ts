import { randomUUID } from "node:crypto";
import type { CreateTaskData } from "../../factories/task.factory.js";
import { TasksRepository } from "../tasks.repository.js";
import type { CreatedTask } from "../tasks.repository.js";
import { Task } from "../../../generated/prisma/client.js";

export class TasksInMemory extends TasksRepository {
    public items: CreatedTask[] = [];

    async changeScore(id: string, newScore: number): Promise<void | null> {
        const task = await this.items.find((task) => task.id === id)

        if(!task){
            return null
        }

        task.score = newScore
    }

    async listTasks(): Promise<Task[]> {
        return [...this.items]
            .sort((firstTask, secondTask) => secondTask.score - firstTask.score)
            .map(({ resources, ...task }) => ({
                ...task,
                resourceCount: resources.length
            }));
    }

    async findById(id: string): Promise<Task | null> {
        return this.items.find((task) => task.id === id) ?? null;
    }

    async delete(id: string): Promise<void> {
        this.items = this.items.filter((task) => task.id !== id);
    }

    async create(data: CreateTaskData): Promise<CreatedTask> {
        const taskId = randomUUID();
        const createdAt = new Date();
        const task: CreatedTask = {
            id: taskId,
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
                createdAt
            })),
            createdAt,
            updatedAt: createdAt
        };

        this.items.push(task);

        return task;
    }
}
