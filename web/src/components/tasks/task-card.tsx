'use client';

import Link from 'next/link';
import { useState } from 'react';
import { PriorityBadge, PriorityRail, ScoreNumber } from '@/components/tasks/score-display';
import { TaskActions } from '@/components/tasks/task-actions';
import {
  DeleteTaskDialog,
  IncreasePriorityDialog,
  ProductivityDialog,
} from '@/components/tasks/task-dialogs';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils/cn';
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

  return (
    <Card className={cn('relative overflow-hidden', isHighlighted && 'settle-highlight')}>
      <PriorityRail score={task.score} />

      <div className="py-4 pl-5 pr-4 sm:pl-6">
        <div className="flex gap-4">
          <div className="w-11 shrink-0 pt-0.5">
            <ScoreNumber score={task.score} />
          </div>

          <div className="min-w-0 flex-1">
            {/* flex-wrap + sm:ml-auto: no desktop o badge vai para a direita,
                no mobile ele cai para a linha de baixo, sem duplicar no DOM. */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
              <h3 className="min-w-0 text-base font-semibold leading-snug text-ink">
                <Link
                  href={`/tarefas/${task.id}`}
                  className="rounded-sm transition-colors hover:text-brand-strong"
                >
                  {task.title}
                </Link>
              </h3>
              <PriorityBadge score={task.score} className="sm:ml-auto" />
            </div>

            {task.description ? (
              <p className="mt-1 line-clamp-2 text-sm text-ink-soft">{task.description}</p>
            ) : null}

            {task.resourceCount > 0 ? (
              <p className="mt-2 text-xs text-ink-faint">
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
        </div>
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
