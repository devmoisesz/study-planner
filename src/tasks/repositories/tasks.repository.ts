import type { Productivity, Resource, Task } from "../../generated/prisma/client.js";
import type { CreateTaskData } from "../factories/task.factory.js";

export type CreatedTask = Task & { resources: Resource[] };
export type TaskDetails = Task & {
    resources: Resource[];
    productivities: Productivity[];
};
export interface UpdateTaskData {
    title: string;
    description: string | null;
}

export abstract class TasksRepository {
    abstract create(data: CreateTaskData): Promise<CreatedTask>;
    abstract listTasks(): Promise<Task[]>;
    abstract findById(id: string): Promise<Task | null>;
    abstract findDetailsById(id: string): Promise<TaskDetails | null>;
    abstract delete(id: string): Promise<void>;
    abstract update(id: string, data: UpdateTaskData): Promise<Task>;
    abstract changeScore(id: string, newScore: number): Promise<void | null>;
}
