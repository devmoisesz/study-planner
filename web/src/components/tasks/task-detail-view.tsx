'use client';

import {
  ArrowLeft,
  Layers,
  Pencil,
  Trash2,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { EditTaskForm } from '@/components/tasks/edit-task-form';
import type { EditTaskValues } from '@/components/tasks/edit-task-form';
import { PriorityBadge, ScoreNumber } from '@/components/tasks/score-display';
import {
  DeleteTaskDialog,
  IncreasePriorityDialog,
  ProductivityDialog,
} from '@/components/tasks/task-dialogs';
import {
  useDeleteTask,
  useIncreasePriority,
  useRegisterProductivity,
  useTask,
  useUpdateTask,
} from '@/components/tasks/use-tasks';
import { ResourceList } from '@/components/resources/resource-list';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ErrorState } from '@/components/ui/error-state';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/toast';
import { getErrorMessage } from '@/lib/api/client';
import { scoreBand } from '@/lib/domain/score';

type OpenDialog = 'productivity' | 'priority' | 'delete' | null;

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-sm font-semibold text-ink">{title}</h2>
      {children}
    </section>
  );
}

function DetailSkeleton() {
  return (
    <div className="flex flex-col gap-6" aria-busy="true" aria-live="polite">
      <span className="sr-only">Carregando a tarefa…</span>
      <Skeleton className="h-8 w-2/3" />
      <Skeleton className="h-24 w-full rounded-lg" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
    </div>
  );
}

export function TaskDetailView({ taskId }: { taskId: string }) {
  const router = useRouter();
  const { notify } = useToast();
  const {
    data: task,
    isPending,
    isError,
    error,
    refetch,
    isFetching,
  } = useTask(taskId);

  const [dialog, setDialog] = useState<OpenDialog>(null);
  const [isEditing, setIsEditing] = useState(false);
  const close = () => setDialog(null);

  const productivity = useRegisterProductivity();
  const priority = useIncreasePriority();
  const removal = useDeleteTask();
  const update = useUpdateTask();

  if (isPending) return <DetailSkeleton />;

  if (isError || !task) {
    return (
      <ErrorState
        title="Não foi possível abrir esta tarefa"
        description={
          isError
            ? getErrorMessage(
                error,
                'Não foi possível carregar esta tarefa. Tente novamente.',
              )
            : 'Esta tarefa não está mais disponível.'
        }
        onRetry={() => void refetch()}
        isRetrying={isFetching}
      />
    );
  }

  const band = scoreBand(task.score);

  function handleProductivity(percentage: number) {
    close();
    productivity.mutate(
      { id: taskId, percentage },
      {
        onSuccess: (score) =>
          notify(`Produtividade registrada. O score agora é ${score}.`),
        onError: (error) =>
          notify(
            getErrorMessage(
              error,
              'Não foi possível registrar a produtividade. Tente novamente.',
            ),
            'error',
          ),
      },
    );
  }

  function handlePriority(percentage: number) {
    close();
    priority.mutate(
      { id: taskId, percentage },
      {
        onSuccess: (score) =>
          notify(`Prioridade aumentada. O score agora é ${score}.`),
        onError: (error) =>
          notify(
            getErrorMessage(
              error,
              'Não foi possível aumentar a prioridade. Tente novamente.',
            ),
            'error',
          ),
      },
    );
  }

  function handleDelete() {
    close();
    removal.mutate(taskId, {
      onSuccess: () => {
        notify(`"${task!.title}" foi excluída.`);
        router.push('/');
      },
      onError: (error) =>
        notify(
          getErrorMessage(
            error,
            'Não foi possível excluir a tarefa. Tente novamente.',
          ),
          'error',
        ),
    });
  }

  function handleUpdate(values: EditTaskValues) {
    update.mutate(
      { id: taskId, input: values },
      {
        onSuccess: () => {
          setIsEditing(false);
          notify('Alterações salvas.');
        },
        onError: (error) =>
          notify(
            getErrorMessage(
              error,
              'Não foi possível salvar as alterações. Tente novamente.',
            ),
            'error',
          ),
      },
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <Link
        href="/"
        className="inline-flex w-fit items-center gap-1.5 rounded-sm text-sm font-medium text-ink-soft transition-colors hover:text-ink"
      >
        <ArrowLeft aria-hidden className="size-4" />
        Voltar para prioridades
      </Link>

      {isEditing ? (
        <Card className="p-5">
          <EditTaskForm
            defaultValues={{
              title: task.title,
              description: task.description ?? '',
            }}
            onCancel={() => setIsEditing(false)}
            onSubmit={handleUpdate}
            isPending={update.isPending}
          />
        </Card>
      ) : (
        <>
          <header className="flex flex-col gap-4">
            <h1 className="font-display text-2xl font-bold tracking-tight text-ink lg:text-3xl">
              {task.title}
            </h1>

            {/* front.md secao 4: a cor entra so no trilho, nunca no card inteiro. */}
            <Card
              className={`flex items-center gap-4 border-l-4 p-5 ${band.borderLeft}`}
            >
              <ScoreNumber score={task.score} size="lg" />
              <div className="flex flex-col items-start gap-1">
                <PriorityBadge score={task.score} />
                <span className="text-xs text-ink-soft">de 100</span>
              </div>
            </Card>
          </header>

          {task.description ? (
            <Section title="Descrição">
              <p className="whitespace-pre-line text-sm leading-relaxed text-ink-soft">
                {task.description}
              </p>
            </Section>
          ) : null}

          <Section
            title={`Recursos${task.resources.length > 0 ? ` (${task.resources.length})` : ''}`}
          >
            {task.resources.length > 0 ? (
              <ResourceList resources={task.resources} />
            ) : (
              <p className="flex items-center gap-2 rounded-md border border-dashed border-line px-4 py-6 text-sm text-ink-soft">
                <Layers
                  aria-hidden
                  className="size-4 shrink-0 text-ink-faint"
                />
                Nenhum material cadastrado para esta tarefa.
              </p>
            )}
          </Section>

          <Section title="Produtividade">
            {task.productivities.length > 0 ? (
              <ol className="flex flex-col gap-2">
                {task.productivities.map((entry) => (
                  <li
                    key={entry.id}
                    className="flex items-center gap-3 rounded-md border border-line bg-surface px-4 py-3"
                  >
                    <TrendingDown
                      aria-hidden
                      className="size-4 shrink-0 text-ink-faint"
                    />
                    <span className="tabular text-sm font-semibold text-ink">
                      {entry.percentage}%
                    </span>
                    <time
                      dateTime={entry.createdAt}
                      className="ml-auto text-xs text-ink-faint"
                    >
                      {new Intl.DateTimeFormat('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      }).format(new Date(entry.createdAt))}
                    </time>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="rounded-md border border-dashed border-line px-4 py-6 text-sm text-ink-soft">
                Você ainda não registrou progresso aqui. Ao registrar, a
                prioridade cai.
              </p>
            )}
          </Section>

          <Section title="Ações">
            <div className="flex flex-wrap gap-2">
              <Button
                variant="primary"
                onClick={() => setDialog('productivity')}
              >
                <TrendingDown aria-hidden className="size-4" />
                Registrar produtividade
              </Button>
              <Button onClick={() => setDialog('priority')}>
                <TrendingUp aria-hidden className="size-4" />
                Aumentar prioridade
              </Button>
              <Button onClick={() => setIsEditing(true)}>
                <Pencil aria-hidden className="size-4" />
                Editar
              </Button>
              <Button variant="danger" onClick={() => setDialog('delete')}>
                <Trash2 aria-hidden className="size-4" />
                Excluir
              </Button>
            </div>
          </Section>
        </>
      )}

      {dialog === 'productivity' ? (
        <ProductivityDialog
          open
          onClose={close}
          currentScore={task.score}
          isPending={productivity.isPending}
          onConfirm={handleProductivity}
        />
      ) : null}

      {dialog === 'priority' ? (
        <IncreasePriorityDialog
          open
          onClose={close}
          currentScore={task.score}
          isPending={priority.isPending}
          onConfirm={handlePriority}
        />
      ) : null}

      {dialog === 'delete' ? (
        <DeleteTaskDialog
          open
          onClose={close}
          taskTitle={task.title}
          isPending={removal.isPending}
          onConfirm={handleDelete}
        />
      ) : null}
    </div>
  );
}
