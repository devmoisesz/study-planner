import type { Resource, Task } from "../../generated/prisma/client.js";
import type { CreateTaskData } from "../factories/task.factory.js";

export type CreatedTask = Task & { resources: Resource[] };

/** Task do ranking: traz quantos recursos existem, sem carregar todos eles. */
export type RankedTask = Task & { resourceCount: number };

export abstract class TasksRepository {
    abstract create(data: CreateTaskData): Promise<CreatedTask>;
    abstract listTasks(): Promise<RankedTask[]>;
    abstract findById(id: string): Promise<Task | null>;
    abstract delete(id: string): Promise<void>;
}
