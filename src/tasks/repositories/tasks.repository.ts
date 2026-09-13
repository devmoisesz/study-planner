import type { Resource, Task } from "../../generated/prisma/client.js";
import type { CreateTaskData } from "../factories/task.factory.js";

export type CreatedTask = Task & { resources: Resource[] };

export abstract class TasksRepository {
    abstract create(data: CreateTaskData): Promise<CreatedTask>;
    abstract listTasks(): Promise<Task[]>;
    abstract findById(id: string): Promise<Task | null>;
    abstract delete(id: string): Promise<void>;
}
