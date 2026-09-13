'use client';

import { ArrowUpRight, Ellipsis, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';

interface TaskActionsProps {
  taskId: string;
  taskTitle: string;
  onRegisterProductivity: () => void;
  onIncreasePriority: () => void;
  onDelete: () => void;
}

export function TaskActions({
  taskId,
  taskTitle,
  onRegisterProductivity,
  onIncreasePriority,
  onDelete,
}: TaskActionsProps) {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <>
      <div className="mt-4 flex items-end gap-1 border-t border-current/10 pt-3">
        <div className="flex min-w-0 flex-1 flex-col items-start gap-1">
          <Button size="sm" variant="ghost" onClick={onRegisterProductivity}>
            Produtividade
          </Button>

          <Button size="sm" variant="ghost" onClick={onIncreasePriority}>
            Aumentar prioridade
          </Button>
        </div>

        <Button
          size="sm"
          variant="ghost"
          className="size-8 shrink-0 px-0"
          aria-label={`Mais ações para ${taskTitle}`}
          onClick={() => setSheetOpen(true)}
        >
          <Ellipsis aria-hidden className="size-4" />
        </Button>
      </div>

      <Dialog
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title={taskTitle}
        description="O que você quer fazer com esta tarefa?"
        className="sm:max-w-sm"
      >
        <div className="flex flex-col gap-1">
          <Link
            href={`/tarefas/${taskId}`}
            className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-background"
          >
            <ArrowUpRight aria-hidden className="size-4 shrink-0 text-ink-faint" />
            Abrir tarefa
          </Link>

          <button
            type="button"
            onClick={() => {
              setSheetOpen(false);
              onDelete();
            }}
            className="flex items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-medium text-danger transition-colors hover:bg-danger-soft"
          >
            <Trash2 aria-hidden className="size-4 shrink-0" />
            Excluir tarefa
          </button>
        </div>
      </Dialog>
    </>
  );
}
