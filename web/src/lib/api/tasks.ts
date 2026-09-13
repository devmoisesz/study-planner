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
  ResourceWithTask,
  Task,
  TaskWithResources,
} from '@/types/api';
import { apiFetch } from './client';
import {
  productivitiesOf,
  readOverlay,
  rememberEdit,
  rememberProductivity,
  rememberScore,
} from './mock/store';

export interface TaskDetail extends Task {
  resources: Resource[];
  productivities: Productivity[];
}

export interface TaskEditInput {
  title: string;
  description?: string;
}

/**
 * Aplica o overlay sobre a resposta real e reordena.
 *
 * Sobrou pouco: score e edicao de titulo/descricao, porque PATCH e as rotas
 * de produtividade e aumento ainda nao existem. A reordenacao e obrigatoria
 * enquanto o score puder mudar localmente.
 */
function withOverlay(tasks: RankedTask[]): RankedTask[] {
  const overlay = readOverlay();

  const adjusted = tasks.map((task): RankedTask => {
    const edit = overlay.edits[task.id];
    const score = overlay.scores[task.id];

    return {
      ...task,
      title: edit?.title ?? task.title,
      description: edit?.description === undefined ? task.description : edit.description,
      score: score ?? task.score,
    };
  });

  return byScoreDesc(adjusted);
}

/** REAL — GET /tasks/list. Traz resourceCount, sem carregar os recursos. */
export async function listTasks(): Promise<RankedTask[]> {
  const tasks = await apiFetch<RankedTask[]>('/tasks/list');
  return withOverlay(tasks);
}

/** REAL — POST /tasks. A resposta inclui os resources criados. */
export async function createTask(input: CreateTaskInput): Promise<TaskWithResources> {
  return apiFetch<TaskWithResources>('/tasks', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

/** REAL — DELETE /tasks/:id. Recursos saem junto por cascade. */
export async function deleteTask(id: string): Promise<void> {
  await apiFetch<void>(`/tasks/${id}`, { method: 'DELETE' });
}

/** REAL — GET /resources. */
export async function listResources(): Promise<ResourceWithTask[]> {
  return apiFetch<ResourceWithTask[]>('/resources');
}

/** TODO(api): trocar por GET /tasks/:id */
export async function getTask(id: string): Promise<TaskDetail> {
  const [tasks, resources] = await Promise.all([listTasks(), listResources()]);
  const task = tasks.find((candidate) => candidate.id === id);

  if (!task) throw new Error('Tarefa não encontrada.');

  return {
    ...task,
    // Os recursos ja vem da API; so o filtro por tarefa e feito aqui,
    // porque nao existe GET /tasks/:id que os traga junto.
    resources: resources.filter((resource) => resource.taskId === id),
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
