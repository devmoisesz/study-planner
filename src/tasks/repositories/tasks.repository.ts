import type {
  Productivity,
  Resource,
  Task,
} from '../../generated/prisma/client.js';
import type { CreateTaskData } from '../factories/task.factory.js';

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
  abstract listTasks(userId: string): Promise<Task[]>;
  abstract findById(id: string, userId: string): Promise<Task | null>;
  abstract findDetailsById(
    id: string,
    userId: string,
  ): Promise<TaskDetails | null>;
  abstract delete(id: string, userId: string): Promise<void>;
  abstract update(
    id: string,
    userId: string,
    data: UpdateTaskData,
  ): Promise<Task>;
  abstract changeScore(
    id: string,
    userId: string,
    newScore: number,
  ): Promise<void | null>;
}
