import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { RankedTask, ResourceWithTask } from '@/types/api';
import {
  deleteTask,
  getTask,
  increasePriority,
  listResources,
  listTasks,
  registerProductivity,
  updateTask,
} from './tasks';

/** localStorage minimo em memoria — o ambiente deste projeto e node. */
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
let requests: { url: string; method: string }[];

/** Encena as tres rotas reais que o backend expoe. */
function stubApi() {
  requests = [];

  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string, init?: RequestInit) => {
      const method = init?.method ?? 'GET';
      requests.push({ url, method });

      if (method === 'DELETE') {
        const id = url.split('/').pop();
        backendTasks = backendTasks.filter((item) => item.id !== id);
        // Cascade no banco: os recursos da tarefa saem junto.
        backendResources = backendResources.filter((item) => item.taskId !== id);
        return new Response(null, { status: 204 });
      }

      if (url.endsWith('/resources')) {
        return new Response(JSON.stringify(backendResources), { status: 200 });
      }

      return new Response(JSON.stringify(backendTasks), { status: 200 });
    }),
  );
}

beforeEach(() => {
  installLocalStorage();
  backendTasks = [
    task('alta', 'Trabalho da ETEC', 81, 2),
    task('media', 'Simulado Fatec', 52),
    task('baixa', 'Revisar Guerra Fria', 31, 1),
  ];
  backendResources = [
    {
      id: 'r1',
      title: 'Slides de modelagem',
      type: 'PDF',
      url: 'https://example.com/slides.pdf',
      description: null,
      taskId: 'alta',
      createdAt: '2026-09-13T00:00:00.000Z',
      taskTitle: 'Trabalho da ETEC',
    },
    {
      id: 'r2',
      title: 'Documentação do PostgreSQL',
      type: 'WEBSITE',
      url: 'https://postgresql.org/docs',
      description: null,
      taskId: 'alta',
      createdAt: '2026-09-13T00:00:00.000Z',
      taskTitle: 'Trabalho da ETEC',
    },
    {
      id: 'r3',
      title: 'Capítulo 14',
      type: 'BOOK',
      url: null,
      description: 'Páginas 212 a 240',
      taskId: 'baixa',
      createdAt: '2026-09-13T00:00:00.000Z',
      taskTitle: 'Revisar Guerra Fria',
    },
  ];
  stubApi();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('listTasks', () => {
  it('devolve as tarefas reais ordenadas por score desc', async () => {
    expect((await listTasks()).map((item) => item.id)).toEqual(['alta', 'media', 'baixa']);
  });

  it('usa o resourceCount que VEM DA API, sem contar nada localmente', async () => {
    const tasks = await listTasks();

    expect(tasks.map((item) => item.resourceCount)).toEqual([2, 0, 1]);
    expect(requests).toEqual([{ url: '/api/tasks/list', method: 'GET' }]);
  });
});

describe('deleteTask', () => {
  it('chama DELETE na API em vez de esconder localmente', async () => {
    await deleteTask('media');

    expect(requests).toContainEqual({ url: '/api/tasks/media', method: 'DELETE' });
  });

  it('a tarefa some do ranking porque o servidor deixou de devolve-la', async () => {
    await deleteTask('media');

    expect((await listTasks()).map((item) => item.id)).toEqual(['alta', 'baixa']);
  });

  it('leva os recursos junto, como o cascade do banco', async () => {
    await deleteTask('alta');

    expect((await listResources()).map((item) => item.id)).toEqual(['r3']);
  });
});

describe('listResources', () => {
  it('vem da API com o titulo da tarefa de origem', async () => {
    const resources = await listResources();

    expect(requests).toContainEqual({ url: '/api/resources', method: 'GET' });
    expect(resources).toHaveLength(3);
    expect(resources[0]).toMatchObject({
      title: 'Slides de modelagem',
      taskTitle: 'Trabalho da ETEC',
    });
  });
});

describe('getTask', () => {
  it('junta a tarefa do list com os recursos reais filtrados por id', async () => {
    const detail = await getTask('alta');

    expect(detail.title).toBe('Trabalho da ETEC');
    expect(detail.resources.map((item) => item.id)).toEqual(['r1', 'r2']);
  });

  it('falha de forma explicita quando a tarefa nao existe', async () => {
    await expect(getTask('inexistente')).rejects.toThrow('Tarefa não encontrada.');
  });
});

describe('overlay do que ainda nao tem rota', () => {
  it('aplica a edicao de titulo e descricao', async () => {
    await updateTask('alta', { title: 'Trabalho da ETEC — banco de dados', description: 'Modelagem' });

    const [first] = await listTasks();
    expect(first?.title).toBe('Trabalho da ETEC — banco de dados');
    expect(first?.description).toBe('Modelagem');
  });

  it('limpa a descricao quando o texto fica em branco', async () => {
    await updateTask('alta', { title: 'Trabalho da ETEC', description: '   ' });

    expect((await listTasks())[0]?.description).toBeNull();
  });
});

describe('registerProductivity', () => {
  it('reduz o score pela formula do plan.md', async () => {
    // 81 x (1 - 0.55) = 36.45 -> 36
    expect(await registerProductivity('alta', 55)).toBe(36);
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
    expect(detail.productivities.map((item) => item.percentage)).toEqual(
      expect.arrayContaining([40, 20]),
    );
  });
});

describe('increasePriority', () => {
  it('aumenta o score pela formula do plan.md', async () => {
    // 31 x 1.5 = 46.5 -> 47
    expect(await increasePriority('baixa', 50)).toBe(47);
  });

  it('nunca passa de 100', async () => {
    expect(await increasePriority('alta', 90)).toBe(100);
  });
});
