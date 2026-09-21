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

export interface UploadPdfInput {
  taskId: string;
  title: string;
  description?: string;
  file: File;
}

export type PendingPdfUpload = Omit<UploadPdfInput, 'taskId'>;

export interface CreateTaskWithPdfUploadsResult {
  task: TaskWithResources;
  failedUploads: number;
  uploadFailures: Array<{ title: string; error: unknown }>;
}

export async function listTasks(): Promise<RankedTask[]> {
  return apiFetch<RankedTask[]>('/tasks/list');
}

export async function createTask(
  input: CreateTaskInput,
): Promise<TaskWithResources> {
  return apiFetch<TaskWithResources>('/tasks', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function uploadPdf(input: UploadPdfInput): Promise<Resource> {
  const formData = new FormData();
  formData.append('taskId', input.taskId);
  formData.append('title', input.title);
  if (input.description) formData.append('description', input.description);
  formData.append('file', input.file);

  return apiFetch<Resource>('/resources/pdf', {
    method: 'POST',
    body: formData,
  });
}

/**
 * A rota de upload exige o id da tarefa. Por isso a tarefa e criada primeiro;
 * somente depois os PDFs sao enviados e associados a ela.
 */
export async function createTaskWithPdfUploads(
  input: CreateTaskInput,
  pdfs: PendingPdfUpload[],
): Promise<CreateTaskWithPdfUploadsResult> {
  const task = await createTask(input);
  const uploads = await Promise.allSettled(
    pdfs.map((pdf) => uploadPdf({ ...pdf, taskId: task.id })),
  );

  const uploadFailures = uploads.flatMap((result, index) =>
    result.status === 'rejected'
      ? [{ title: pdfs[index]!.title, error: result.reason }]
      : [],
  );

  return {
    task,
    failedUploads: uploadFailures.length,
    uploadFailures,
  };
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

export async function updateTask(
  id: string,
  input: TaskEditInput,
): Promise<void> {
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
export async function registerProductivity(
  id: string,
  percentage: number,
): Promise<number> {
  await apiFetch<Productivity>(`/tasks/${id}/productivities`, {
    method: 'POST',
    body: JSON.stringify({ percentage: percentage / 100 }),
  });

  return (await getTask(id)).score;
}

/** The same percentage-point to ratio conversion applies to priority boosts. */
export async function increasePriority(
  id: string,
  percentage: number,
): Promise<number> {
  const task = await apiFetch<Task>(`/tasks/${id}/priority-boost`, {
    method: 'POST',
    body: JSON.stringify({ percentage: percentage / 100 }),
  });

  return task.score;
}
