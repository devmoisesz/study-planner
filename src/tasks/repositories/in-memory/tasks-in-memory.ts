import { randomUUID } from "node:crypto";
import type { CreateTaskData } from "../../factories/task.factory.js";
import { TasksRepository } from "../tasks.repository.js";
import type { CreatedTask } from "../tasks.repository.js";

export class TasksInMemory extends TasksRepository {
    public items: CreatedTask[] = [];

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
