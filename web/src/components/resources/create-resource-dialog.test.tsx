import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Mock } from 'vitest';
import { TaskDetailView } from '@/components/tasks/task-detail-view';
import { ToastProvider } from '@/components/ui/toast';
import type { TaskDetail } from '@/lib/api/tasks';
import { queryKeys } from '@/lib/query/keys';
import type { Resource } from '@/types/api';

let task: TaskDetail;
let client: QueryClient;
let post: Mock<(input: Resource) => Promise<Response>>;

function json(value: unknown, status = 200) {
  return new Response(JSON.stringify(value), { status });
}

beforeEach(() => {
  task = {
    id: 'task-1',
    title: 'Estudar lógica',
    description: null,
    score: 50,
    createdAt: '2026-09-27T12:00:00Z',
    updatedAt: '2026-09-27T12:00:00Z',
    resources: [],
    productivities: [],
  };
  client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  client.setQueryData(queryKeys.tasks, []);
  client.setQueryData(queryKeys.resources, []);
  post = vi.fn(async (input: Resource) => {
    const resource = {
      ...input,
      id: 'resource-1',
      taskId: task.id,
      createdAt: task.createdAt,
    };
    task = { ...task, resources: [...task.resources, resource] };
    return json(resource, 201);
  });
  vi.stubGlobal(
    'fetch',
    vi.fn(async (_url: string, init?: RequestInit) => {
      if (init?.method === 'POST') return post(JSON.parse(init.body as string));
      return json(task);
    }),
  );
});

afterEach(() => {
  client.clear();
  vi.unstubAllGlobals();
});

async function openForm() {
  const user = userEvent.setup();
  render(
    <QueryClientProvider client={client}>
      <ToastProvider>
        <TaskDetailView taskId={task.id} />
      </ToastProvider>
    </QueryClientProvider>,
  );
  await user.click(
    await screen.findByRole('button', { name: 'Adicionar recurso' }),
  );
  const dialog = screen.getByRole('dialog', { name: 'Adicionar recurso' });
  return {
    user,
    dialog,
    submit: within(dialog).getByRole('button', { name: 'Adicionar recurso' }),
  };
}

describe('Adicionar recurso a uma tarefa', () => {
  it('envia o recurso, atualiza a lista e invalida ranking e biblioteca', async () => {
    const { user, submit } = await openForm();
    await user.type(screen.getByLabelText('Título'), '  Aula de lógica  ');
    await user.type(
      screen.getByLabelText('Link (opcional)'),
      'https://youtube.com/watch?v=lesson',
    );
    await user.type(
      screen.getByLabelText('Descrição (opcional)'),
      '  Condicionais e loops  ',
    );
    await user.click(submit);

    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
    expect(post).toHaveBeenCalledExactlyOnceWith({
      title: 'Aula de lógica',
      type: 'YOUTUBE',
      url: 'https://youtube.com/watch?v=lesson',
      description: 'Condicionais e loops',
    });
    expect(fetch).toHaveBeenCalledWith(
      '/api/tasks/task-1/resources',
      expect.objectContaining({ method: 'POST' }),
    );
    expect(
      await screen.findByRole('heading', { name: 'Aula de lógica' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Recursos (1)' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Recurso adicionado à tarefa.'),
    ).toBeInTheDocument();
    expect(client.getQueryState(queryKeys.tasks)?.isInvalidated).toBe(true);
    expect(client.getQueryState(queryKeys.resources)?.isInvalidated).toBe(true);
    await user.click(screen.getByRole('button', { name: 'Adicionar recurso' }));
    expect(screen.getByLabelText('Título')).toHaveValue('');
  });

  it.each(['YOUTUBE', 'BOOK', 'PDF', 'WEBSITE', 'OTHER'])(
    'permite %s sem link nem descrição',
    async (type) => {
      const { user, submit } = await openForm();
      await user.type(screen.getByLabelText('Título'), 'Material');
      await user.selectOptions(screen.getByLabelText('Tipo'), type);
      await user.click(submit);
      await waitFor(() =>
        expect(post).toHaveBeenCalledExactlyOnceWith({
          title: 'Material',
          type,
        }),
      );
    },
  );

  it('valida título e URL antes de enviar, com foco no campo inválido', async () => {
    const { user, submit } = await openForm();
    await user.click(submit);
    expect(
      await screen.findByText('Dê um título ao recurso.'),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Título')).toHaveFocus();
    await user.type(screen.getByLabelText('Título'), 'Material');
    await user.type(screen.getByLabelText('Link (opcional)'), 'link-invalido');
    await user.click(submit);
    expect(
      await screen.findByText(/Informe um endereço completo/),
    ).toBeInTheDocument();
    expect(post).not.toHaveBeenCalled();
  });

  it('preserva os dados após erro e permite tentar novamente', async () => {
    post.mockResolvedValueOnce(json({}, 500));
    const { user, submit } = await openForm();
    await user.type(screen.getByLabelText('Título'), 'Minha aula');
    await user.click(submit);
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'O servidor encontrou um problema',
    );
    expect(screen.getByLabelText('Título')).toHaveValue('Minha aula');
    expect(submit).toBeEnabled();
    await user.click(submit);
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
    expect(post).toHaveBeenCalledTimes(2);
  });

  it('bloqueia duplicação e fechamento durante o envio', async () => {
    let resolve!: (value: Response) => void;
    post.mockImplementationOnce(
      () =>
        new Promise<Response>((done) => {
          resolve = done;
        }),
    );
    const { user, dialog, submit } = await openForm();
    await user.type(screen.getByLabelText('Título'), 'Minha aula');
    await user.click(submit);
    expect(submit).toBeDisabled();
    expect(submit).toHaveTextContent('Adicionando');
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Fechar' })).toBeDisabled();
    const cancel = new Event('cancel', { cancelable: true });
    fireEvent(dialog, cancel);
    expect(cancel.defaultPrevented).toBe(true);
    fireEvent.click(dialog);
    await user.click(submit);
    expect(dialog).toBeInTheDocument();
    expect(post).toHaveBeenCalledTimes(1);
    await act(async () => resolve(json({ id: 'resource-1' }, 201)));
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
  });

  it('cancela sem enviar', async () => {
    const { user } = await openForm();
    await user.type(screen.getByLabelText('Título'), 'Rascunho');
    await user.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(post).not.toHaveBeenCalled();
  });
});
