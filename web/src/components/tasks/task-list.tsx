'use client';

import { TaskCard } from '@/components/tasks/task-card';
import type { RankedTask } from '@/types/api';

interface TaskListProps {
  tasks: readonly RankedTask[];
  onRegisterProductivity: (id: string, percentage: number) => void;
  onIncreasePriority: (id: string, percentage: number) => void;
  onDelete: (id: string) => void;
  pendingTaskId?: string | null;
  highlightedTaskId?: string | null;
}

/**
 * Lista ordenada de propósito: a ordem É a informação. `<ol>` faz o leitor
 * de tela anunciar "item 1 de 5", que e exatamente o ranking.
 */
export function TaskList({
  tasks,
  onRegisterProductivity,
  onIncreasePriority,
  onDelete,
  pendingTaskId,
  highlightedTaskId,
}: TaskListProps) {
  return (
    <ol className="flex flex-col gap-3">
      {tasks.map((task) => (
        <li key={task.id}>
          <TaskCard
            task={task}
            isPending={pendingTaskId === task.id}
            isHighlighted={highlightedTaskId === task.id}
            onRegisterProductivity={(percentage) => onRegisterProductivity(task.id, percentage)}
            onIncreasePriority={(percentage) => onIncreasePriority(task.id, percentage)}
            onDelete={() => onDelete(task.id)}
          />
        </li>
      ))}
    </ol>
  );
}
