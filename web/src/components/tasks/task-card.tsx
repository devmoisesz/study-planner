'use client';

import Link from 'next/link';
import { useState } from 'react';
import { LibraryBig } from 'lucide-react';
import { PriorityBadge, PriorityRail, ScoreNumber } from '@/components/tasks/score-display';
import { TaskActions } from '@/components/tasks/task-actions';
import {
  DeleteTaskDialog,
  IncreasePriorityDialog,
  ProductivityDialog,
} from '@/components/tasks/task-dialogs';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils/cn';
import { scoreBand } from '@/lib/domain/score';
import type { RankedTask } from '@/types/api';

type OpenDialog = 'productivity' | 'priority' | 'delete' | null;

interface TaskCardProps {
  task: RankedTask;
  onRegisterProductivity: (percentage: number) => void;
  onIncreasePriority: (percentage: number) => void;
  onDelete: () => void;
  isPending?: boolean;
  /** Destaca o card logo apos o score mudar, para nao se perder no ranking. */
  isHighlighted?: boolean;
}

export function TaskCard({
  task,
  onRegisterProductivity,
  onIncreasePriority,
  onDelete,
  isPending,
  isHighlighted,
}: TaskCardProps) {
  const [dialog, setDialog] = useState<OpenDialog>(null);
  const close = () => setDialog(null);
  const band = scoreBand(task.score);

  return (
    <Card
      className={cn(
        'relative flex min-h-72 flex-col overflow-hidden border shadow-card transition-[transform,box-shadow] duration-150 hover:-translate-y-0.5 hover:shadow-raised',
        band.card,
        isHighlighted && 'settle-highlight',
      )}
    >
      <PriorityRail score={task.score} />

      <div className="flex min-h-72 flex-col p-5 pt-6">
        <div className="flex items-start justify-between gap-3">
          <ScoreNumber score={task.score} size="lg" />
          <PriorityBadge score={task.score} />
        </div>

        <div className="mt-6 min-w-0 flex-1">
          <h3 className="line-clamp-2 text-lg font-semibold leading-snug text-ink">
            <Link
              href={`/tarefas/${task.id}`}
              className="rounded-sm transition-colors hover:text-brand-strong"
            >
              {task.title}
            </Link>
          </h3>

          {task.description ? (
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-soft">{task.description}</p>
          ) : null}
        </div>

        {task.resourceCount > 0 ? (
          <p className={cn('mt-5 flex items-center gap-1.5 text-xs font-medium', band.text)}>
            <LibraryBig aria-hidden className="size-3.5" />
            {task.resourceCount === 1 ? '1 recurso' : `${task.resourceCount} recursos`}
          </p>
        ) : null}

        <TaskActions
          taskId={task.id}
          taskTitle={task.title}
          onRegisterProductivity={() => setDialog('productivity')}
          onIncreasePriority={() => setDialog('priority')}
          onDelete={() => setDialog('delete')}
        />
      </div>

      {/* Montados so quando abertos: cada abertura comeca com estado limpo. */}
      {dialog === 'productivity' ? (
        <ProductivityDialog
          open
          onClose={close}
          currentScore={task.score}
          isPending={isPending}
          onConfirm={(percentage) => {
            close();
            onRegisterProductivity(percentage);
          }}
        />
      ) : null}

      {dialog === 'priority' ? (
        <IncreasePriorityDialog
          open
          onClose={close}
          currentScore={task.score}
          isPending={isPending}
          onConfirm={(percentage) => {
            close();
            onIncreasePriority(percentage);
          }}
        />
      ) : null}

      {dialog === 'delete' ? (
        <DeleteTaskDialog
          open
          onClose={close}
          taskTitle={task.title}
          isPending={isPending}
          onConfirm={() => {
            close();
            onDelete();
          }}
        />
      ) : null}
    </Card>
  );
}
