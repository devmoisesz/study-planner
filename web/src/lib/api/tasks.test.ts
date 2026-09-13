import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Task, TaskWithResources } from '@/types/api';
import {
  createTask,
  deleteTask,
  getTask,
  increasePriority,
  listResources,
  listTasks,
  registerProductivity,
  updateTask,
} from './tasks';

/** localStorage minimo em memoria — o ambiente de teste e node. */
function installLocalStorage() {
  const data = new Map<string, string>();

  vi.stubGlobal('localStorage', {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
    removeItem: (key: string) => void data.delete(key),
    clear: () => data.clear(),
  });
  vi.stubGlobal('window', { localStorage: globalThis.localStorage });
}

const task = (id: string, title: string, score: number): Task => ({
  id,
  title,
  description: null,
  score,
  createdAt: '2026-09-13T00:00:00.000Z',
  updatedAt: '2026-09-13T00:00:00.000Z',
});

const BACKEND_TASKS: Task[] = [
  task('alta', 'Trabalho da ETEC', 81),
  task('media', 'Simulado Fatec', 52),
  task('baixa', 'Revisar Guerra Fria', 31),
];

function stubFetch(tasks: Task[] = BACKEND_TASKS) {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => new Response(JSON.stringify(tasks), { status: 200 })),
  );
}

beforeEach(() => {
  installLocalStorage();
  stubFetch();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('listTasks', () => {
  it('devolve as tarefas reais ordenadas por score desc', async () => {
    const tasks = await listTasks();
    expect(tasks.map((item) => item.id)).toEqual(['alta', 'media', 'baixa']);
  });

  it('comeca com contagem de recursos zerada (o list nao traz resources)', async () => {
    const tasks = await listTasks();
    expect(tasks.every((item) => item.resourceCount === 0)).toBe(true);
  });
});

describe('overlay sobre a resposta real', () => {
  it('remove do ranking a tarefa excluida', async () => {
    await deleteTask('media');

    const tasks = await listTasks();
    expect(tasks.map((item) => item.id)).toEqual(['alta', 'baixa']);
  });

  it('aplica a edicao de titulo e descricao', async () => {
    await updateTask('alta', { title: 'Trabalho da ETEC — banco de dados', description: 'Modelagem' });

    const [first] = await listTasks();
    expect(first?.title).toBe('Trabalho da ETEC — banco de dados');
    expect(first?.description).toBe('Modelagem');
  });

  it('limpa a descricao quando o texto fica em branco', async () => {
    await updateTask('alta', { title: 'Trabalho da ETEC', description: '   ' });

    const [first] = await listTasks();
    expect(first?.description).toBeNull();
  });
});

describe('registerProductivity', () => {
  it('reduz o score pela formula do plan.md', async () => {
    const next = await registerProductivity('alta', 55);
    // 81 x (1 - 0.55) = 36.45 -> 36
    expect(next).toBe(36);
  });

  it('REORDENA o ranking, porque a ordem do backend deixou de valer', async () => {
    await registerProductivity('alta', 55);

    const tasks = await listTasks();
    expect(tasks.map((item) => item.id)).toEqual(['media', 'alta', 'baixa']);
    expect(tasks.find((item) => item.id === 'alta')?.score).toBe(36);
  });

  it('guarda o historico de produtividade da tarefa', async () => {
    await registerProductivity('alta', 40);
    await registerProductivity('alta', 20);

    const detail = await getTask('alta');
    expect(detail.productivities).toHaveLength(2);
    expect(detail.productivities.map((item) => item.percentage)).toContain(40);
  });
});

describe('increasePriority', () => {
  it('aumenta o score pela formula do plan.md', async () => {
    const next = await increasePriority('baixa', 50);
    // 31 x 1.5 = 46.5 -> 47
    expect(next).toBe(47);
  });

  it('nunca passa de 100', async () => {
    expect(await increasePriority('alta', 90)).toBe(100);
  });
});

describe('createTask', () => {
  const created: TaskWithResources = {
    ...task('nova', 'Estudar Trigonometria', 82),
    resources: [
      {
        id: 'r1',
        title: 'Aula de Trigonometria',
        type: 'YOUTUBE',
        url: 'https://youtube.com/aula',
        description: null,
        taskId: 'nova',
        createdAt: '2026-09-13T00:00:00.000Z',
      },
    ],
  };

  it('guarda os recursos REAIS devolvidos pelo POST para o list poder conta-los', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(JSON.stringify(created), { status: 201 })),
    );

    await createTask({
      title: 'Estudar Trigonometria',
      importance: 9,
      domain: 3,
      urgency: 8,
      relevance: 9,
    });

    stubFetch([...BACKEND_TASKS, task('nova', 'Estudar Trigonometria', 82)]);

    const tasks = await listTasks();
    expect(tasks.find((item) => item.id === 'nova')?.resourceCount).toBe(1);

    const resources = await listResources();
    expect(resources).toHaveLength(1);
    expect(resources[0]).toMatchObject({
      title: 'Aula de Trigonometria',
      taskTitle: 'Estudar Trigonometria',
    });
  });
});

describe('getTask', () => {
  it('falha de forma explicita quando a tarefa nao existe', async () => {
    await expect(getTask('inexistente')).rejects.toThrow('Tarefa não encontrada.');
  });
});
