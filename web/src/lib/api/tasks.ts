import type {
  CreateTaskInput,
  Productivity,
  RankedTask,
  Resource,
  ResourceWithTask,
  Task,
  TaskWithResources,
} from '@/types/api';
import { apiFetch } from './client';

export interface TaskDetail extends Task {
  resources: Resource[];
  productivities: Productivity[];
}

export interface TaskEditInput {
  title: string;
  description?: string;
}

export async function listTasks(): Promise<RankedTask[]> {
  return apiFetch<RankedTask[]>('/tasks/list');
}

export async function createTask(input: CreateTaskInput): Promise<TaskWithResources> {
  return apiFetch<TaskWithResources>('/tasks', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function deleteTask(id: string): Promise<void> {
  await apiFetch<void>(`/tasks/${id}`, { method: 'DELETE' });
}

export async function listResources(): Promise<ResourceWithTask[]> {
  return apiFetch<ResourceWithTask[]>('/resources');
}

export async function getTask(id: string): Promise<TaskDetail> {
  return apiFetch<TaskDetail>(`/tasks/${id}`);
}

export async function updateTask(id: string, input: TaskEditInput): Promise<void> {
  await apiFetch<Task>(`/tasks/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({
      title: input.title,
      description: input.description ?? '',
    }),
  });
}

/**
 * The UI accepts whole percentage points (0-100). The API receives a ratio:
 * 60% in the dialog becomes 0.6 in the request body.
 */
export async function registerProductivity(id: string, percentage: number): Promise<number> {
  await apiFetch<Productivity>(`/tasks/${id}/productivities`, {
    method: 'POST',
    body: JSON.stringify({ percentage: percentage / 100 }),
  });

  return (await getTask(id)).score;
}

/** The same percentage-point to ratio conversion applies to priority boosts. */
export async function increasePriority(id: string, percentage: number): Promise<number> {
  const task = await apiFetch<Task>(`/tasks/${id}/priority-boost`, {
    method: 'POST',
    body: JSON.stringify({ percentage: percentage / 100 }),
  });

  return task.score;
}
