import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Productivity, RankedTask, ResourceWithTask } from '@/types/api';
import {
  deleteTask,
  getTask,
  increasePriority,
  listResources,
  listTasks,
  registerProductivity,
  updateTask,
} from './tasks';

const task = (id: string, title: string, score: number, resourceCount = 0): RankedTask => ({
  id,
  title,
  description: null,
  score,
  resourceCount,
  createdAt: '2026-09-13T00:00:00.000Z',
  updatedAt: '2026-09-13T00:00:00.000Z',
});

let backendTasks: RankedTask[];
let backendResources: ResourceWithTask[];
let backendProductivities: Record<string, Productivity[]>;
let requests: { url: string; method: string; body?: string }[];

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), { status });
}

function taskDetails(id: string) {
  const currentTask = backendTasks.find((item) => item.id === id);
  if (!currentTask) return null;

  return {
    ...currentTask,
    resources: backendResources
      .filter((resource) => resource.taskId === id)
      .map(({ taskTitle: _taskTitle, ...resource }) => resource),
    productivities: backendProductivities[id] ?? [],
  };
}

function stubApi() {
  requests = [];

  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string, init?: RequestInit) => {
      const method = init?.method ?? 'GET';
      const body = typeof init?.body === 'string' ? init.body : undefined;
      requests.push({ url, method, body });
      const path = new URL(url, 'https://ordo.test').pathname;

      if (method === 'DELETE') {
        const id = path.split('/').pop() as string;
        backendTasks = backendTasks.filter((item) => item.id !== id);
        backendResources = backendResources.filter((item) => item.taskId !== id);
        delete backendProductivities[id];
        return new Response(null, { status: 204 });
      }

      if (method === 'PATCH') {
        const id = path.split('/').pop() as string;
        const payload = JSON.parse(body ?? '{}') as { title: string; description: string };
        const currentTask = backendTasks.find((item) => item.id === id);
        if (!currentTask) return json({ message: 'Task not found' }, 404);

        currentTask.title = payload.title;
        currentTask.description = payload.description.trim() || null;
        return json(currentTask);
      }

      if (method === 'POST' && path.endsWith('/productivities')) {
        const id = path.split('/')[3] as string;
        const payload = JSON.parse(body ?? '{}') as { percentage: number };
        const currentTask = backendTasks.find((item) => item.id === id);
        if (!currentTask) return json({ message: 'Task not found' }, 404);

        currentTask.score = Math.round(currentTask.score * (1 - payload.percentage));
        const productivity: Productivity = {
          id: `productivity-${(backendProductivities[id] ?? []).length + 1}`,
          taskId: id,
          percentage: Math.round(payload.percentage * 100),
          createdAt: '2026-09-13T00:00:00.000Z',
        };
        backendProductivities[id] = [productivity, ...(backendProductivities[id] ?? [])];
        return json(productivity, 201);
      }

      if (method === 'POST' && path.endsWith('/priority-boost')) {
        const id = path.split('/')[3] as string;
        const payload = JSON.parse(body ?? '{}') as { percentage: number };
        const currentTask = backendTasks.find((item) => item.id === id);
        if (!currentTask) return json({ message: 'Task not found' }, 404);

        currentTask.score = Math.min(100, Math.round(currentTask.score * (1 + payload.percentage)));
        return json(currentTask);
      }

      if (path === '/api/resources') return json(backendResources);
      if (path.startsWith('/api/tasks/') && path !== '/api/tasks/list') {
        const detail = taskDetails(path.split('/').pop() as string);
        return detail ? json(detail) : json({ message: 'Task not found' }, 404);
      }

      return json(backendTasks);
    }),
  );
}

beforeEach(() => {
  backendTasks = [
    task('alta', 'Trabalho da ETEC', 81, 2),
    task('media', 'Simulado Fatec', 52),
    task('baixa', 'Revisar Guerra Fria', 31, 1),
  ];
  backendResources = [
    {
      id: 'r1', title: 'Slides de modelagem', type: 'PDF', url: 'https://example.com/slides.pdf',
      description: null, taskId: 'alta', createdAt: '2026-09-13T00:00:00.000Z', taskTitle: 'Trabalho da ETEC',
    },
    {
      id: 'r2', title: 'Documentação do PostgreSQL', type: 'WEBSITE', url: 'https://postgresql.org/docs',
      description: null, taskId: 'alta', createdAt: '2026-09-13T00:00:00.000Z', taskTitle: 'Trabalho da ETEC',
    },
  ];
  backendProductivities = {};
  stubApi();
});

afterEach(() => vi.unstubAllGlobals());

describe('API de tarefas', () => {
  it('usa o ranking e os recursos devolvidos pela API', async () => {
    expect((await listTasks()).map((item) => item.id)).toEqual(['alta', 'media', 'baixa']);
    expect(await listResources()).toHaveLength(2);
    expect(requests).toContainEqual({ url: '/api/tasks/list', method: 'GET', body: undefined });
  });

  it('exclui uma tarefa pela API', async () => {
    await deleteTask('alta');
    expect((await listTasks()).map((item) => item.id)).not.toContain('alta');
    expect((await listResources()).map((item) => item.taskId)).not.toContain('alta');
  });

  it('busca o detalhe completo em uma chamada', async () => {
    const detail = await getTask('alta');
    expect(detail.resources.map((item) => item.id)).toEqual(['r1', 'r2']);
    expect(requests).toEqual([{ url: '/api/tasks/alta', method: 'GET', body: undefined }]);
  });

  it('edita título e remove descrição vazia pela API', async () => {
    await updateTask('alta', { title: 'Trabalho atualizado', description: '   ' });
    await expect(getTask('alta')).resolves.toMatchObject({
      title: 'Trabalho atualizado', description: null,
    });
  });

  it('converte 55% da UI para 0.55 na rota de produtividade', async () => {
    expect(await registerProductivity('alta', 55)).toBe(36);
    expect(requests).toContainEqual({
      url: '/api/tasks/alta/productivities', method: 'POST', body: JSON.stringify({ percentage: 0.55 }),
    });
    await expect(getTask('alta')).resolves.toMatchObject({
      score: 36,
      productivities: [expect.objectContaining({ percentage: 55 })],
    });
  });

  it('converte 50% da UI para 0.5 no aumento de prioridade e respeita o teto', async () => {
    expect(await increasePriority('baixa', 50)).toBe(47);
    expect(requests).toContainEqual({
      url: '/api/tasks/baixa/priority-boost', method: 'POST', body: JSON.stringify({ percentage: 0.5 }),
    });
    expect(await increasePriority('alta', 90)).toBe(100);
  });
});
