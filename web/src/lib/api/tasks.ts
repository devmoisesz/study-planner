/**
 * Superficie unica de dados das telas. Nenhum componente importa de mock/.
 *
 * Funcoes marcadas com TODO(api) ainda nao tem endpoint: elas ja usam a
 * assinatura final e serao trocadas por apiFetch quando o backend existir.
 * Ver ./mock/README.md.
 */

import { applyPriorityBoost, applyProductivity } from '@/lib/domain/productivity';
import { byScoreDesc } from '@/lib/domain/score';
import type {
  CreateTaskInput,
  Productivity,
  RankedTask,
  Resource,
  Task,
  TaskWithResources,
} from '@/types/api';
import { apiFetch } from './client';
import {
  productivitiesOf,
  readOverlay,
  rememberDeletion,
  rememberEdit,
  rememberProductivity,
  rememberResources,
  rememberScore,
  resourcesOf,
} from './mock/store';

export interface TaskDetail extends Task {
  resources: Resource[];
  productivities: Productivity[];
}

export interface ResourceWithTask extends Resource {
  taskTitle: string;
}

export interface TaskEditInput {
  title: string;
  description?: string;
}

/**
 * Aplica o overlay sobre a resposta real e reordena.
 * A reordenacao e obrigatoria: produtividade e aumento mudam o score local,
 * entao a ordem que veio do backend nao vale mais.
 */
function withOverlay(tasks: Task[]): RankedTask[] {
  const overlay = readOverlay();

  const visible = tasks
    .filter((task) => !overlay.deletedIds.includes(task.id))
    .map((task): RankedTask => {
      const edit = overlay.edits[task.id];
      const score = overlay.scores[task.id];

      return {
        ...task,
        title: edit?.title ?? task.title,
        description: edit?.description === undefined ? task.description : edit.description,
        score: score ?? task.score,
        resourceCount: resourcesOf(task.id, overlay).length,
      };
    });

  return byScoreDesc(visible);
}

/** REAL — GET /tasks/list. Ja vem ordenado por score desc do backend. */
export async function listTasks(): Promise<RankedTask[]> {
  const tasks = await apiFetch<Task[]>('/tasks/list');
  return withOverlay(tasks);
}

/** REAL — POST /tasks. A resposta inclui os resources criados. */
export async function createTask(input: CreateTaskInput): Promise<TaskWithResources> {
  const task = await apiFetch<TaskWithResources>('/tasks', {
    method: 'POST',
    body: JSON.stringify(input),
  });

  // O GET /tasks/list nao devolve resources; guardamos os reais que vieram aqui.
  rememberResources(task.id, task.resources);

  return task;
}

/** TODO(api): trocar por GET /tasks/:id */
export async function getTask(id: string): Promise<TaskDetail> {
  const tasks = await listTasks();
  const task = tasks.find((candidate) => candidate.id === id);

  if (!task) throw new Error('Tarefa não encontrada.');

  return {
    ...task,
    resources: resourcesOf(id),
    productivities: productivitiesOf(id),
  };
}

/** TODO(api): trocar por PATCH /tasks/:id */
export async function updateTask(id: string, input: TaskEditInput): Promise<void> {
  rememberEdit(id, {
    title: input.title,
    description: input.description?.trim() ? input.description : null,
  });
}

/** TODO(api): trocar por DELETE /tasks/:id */
export async function deleteTask(id: string): Promise<void> {
  rememberDeletion(id);
}

/** TODO(api): trocar por POST /tasks/:id/productivities */
export async function registerProductivity(id: string, percentage: number): Promise<number> {
  const task = await getTask(id);
  const nextScore = applyProductivity(task.score, percentage);

  rememberProductivity(id, percentage);
  rememberScore(id, nextScore);

  return nextScore;
}

/** TODO(api): trocar por POST /tasks/:id/priority-boost */
export async function increasePriority(id: string, percentage: number): Promise<number> {
  const task = await getTask(id);
  const nextScore = applyPriorityBoost(task.score, percentage);

  rememberScore(id, nextScore);

  return nextScore;
}

/** TODO(api): trocar por GET /resources */
export async function listResources(): Promise<ResourceWithTask[]> {
  const tasks = await listTasks();
  const overlay = readOverlay();

  return tasks.flatMap((task) =>
    resourcesOf(task.id, overlay).map((resource) => ({
      ...resource,
      taskTitle: task.title,
    })),
  );
}
