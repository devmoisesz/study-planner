'use client';

import { ListChecks, Plus } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { TaskList } from '@/components/tasks/task-list';
import { TaskListSkeleton } from '@/components/tasks/task-list-skeleton';
import {
  useDeleteTask,
  useIncreasePriority,
  useRegisterProductivity,
  useTasks,
} from '@/components/tasks/use-tasks';
import { buttonClasses } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { useToast } from '@/components/ui/toast';
import { getErrorMessage } from '@/lib/api/client';
import { scoreBand } from '@/lib/domain/score';

/**
 * Separa busca de dados de apresentacao: este componente decide entre
 * carregando / vazio / erro / lista, e nada mais.
 */
export function TasksView() {
  const {
    data: tasks,
    isPending,
    isError,
    error,
    refetch,
    isFetching,
  } = useTasks();
  const { notify } = useToast();
  const [pendingTaskId, setPendingTaskId] = useState<string | null>(null);
  /** Ultimo card cujo score mudou — some sozinho quando a animacao acaba. */
  const [highlightedTaskId, setHighlightedTaskId] = useState<string | null>(
    null,
  );

  const productivity = useRegisterProductivity();
  const priority = useIncreasePriority();
  const removal = useDeleteTask();

  function failed(fallback: string) {
    return (error: unknown) =>
      notify(getErrorMessage(error, fallback), 'error');
  }

  function handleProductivity(id: string, percentage: number) {
    setPendingTaskId(id);
    productivity.mutate(
      { id, percentage },
      {
        onSuccess: (score) => {
          setHighlightedTaskId(id);
          notify(
            `Produtividade registrada. O score agora é ${score} — ${scoreBand(score).label.toLowerCase()}.`,
          );
        },
        onError: failed('Não foi possível registrar a produtividade.'),
        onSettled: () => setPendingTaskId(null),
      },
    );
  }

  function handlePriority(id: string, percentage: number) {
    setPendingTaskId(id);
    priority.mutate(
      { id, percentage },
      {
        onSuccess: (score) => {
          setHighlightedTaskId(id);
          notify(`Prioridade aumentada. O score agora é ${score}.`);
        },
        onError: failed('Não foi possível aumentar a prioridade.'),
        onSettled: () => setPendingTaskId(null),
      },
    );
  }

  function handleDelete(id: string) {
    const title = tasks?.find((task) => task.id === id)?.title;

    setPendingTaskId(id);
    removal.mutate(id, {
      onSuccess: () =>
        notify(title ? `"${title}" foi excluída.` : 'Tarefa excluída.'),
      onError: failed('Não foi possível excluir a tarefa.'),
      onSettled: () => setPendingTaskId(null),
    });
  }

  if (isPending) return <TaskListSkeleton />;

  if (isError) {
    return (
      <ErrorState
        title="Não foi possível carregar suas tarefas"
        description={getErrorMessage(
          error,
          'Não foi possível carregar suas tarefas. Tente novamente.',
        )}
        onRetry={() => void refetch()}
        isRetrying={isFetching}
      />
    );
  }

  if (tasks.length === 0) {
    return (
      <EmptyState
        icon={ListChecks}
        title="Nenhuma tarefa ainda"
        description="Crie sua primeira tarefa para começar a organizar suas prioridades."
        action={
          <Link
            href="/tarefas/nova"
            className={buttonClasses({ variant: 'primary' })}
          >
            <Plus aria-hidden className="size-4" />
            Nova tarefa
          </Link>
        }
      />
    );
  }

  return (
    <TaskList
      tasks={tasks}
      pendingTaskId={pendingTaskId}
      highlightedTaskId={highlightedTaskId}
      onRegisterProductivity={handleProductivity}
      onIncreasePriority={handlePriority}
      onDelete={handleDelete}
    />
  );
}
