'use client';

import { ArrowUpRight, Ellipsis, Trash2, TrendingUp } from 'lucide-react';
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

/**
 * Acoes do card. No mobile as secundarias vao para uma folha de acoes, em
 * vez de espremer quatro botoes lado a lado (front.md secao 23).
 * A folha reusa o <dialog>: nada de menu flutuante para manter acessivel.
 */
export function TaskActions({
  taskId,
  taskTitle,
  onRegisterProductivity,
  onIncreasePriority,
  onDelete,
}: TaskActionsProps) {
  const [sheetOpen, setSheetOpen] = useState(false);

  function runFromSheet(action: () => void) {
    setSheetOpen(false);
    action();
  }

  return (
    <>
      {/* Ghost de proposito: o titulo e que abre a tarefa. Com seis cards na
          tela, dois botoes com borda cada vira ruido e rouba o peso do score. */}
      <div className="mt-3 -ml-2 flex items-center gap-1">
        <Button size="sm" variant="ghost" onClick={onRegisterProductivity}>
          Produtividade
        </Button>

        <Button
          size="sm"
          variant="ghost"
          className="hidden sm:inline-flex"
          onClick={onIncreasePriority}
        >
          Aumentar prioridade
        </Button>

        <Button
          size="sm"
          variant="ghost"
          className="ml-auto size-8 px-0"
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
            onClick={() => runFromSheet(onIncreasePriority)}
            className="flex items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-medium text-ink transition-colors hover:bg-background sm:hidden"
          >
            <TrendingUp aria-hidden className="size-4 shrink-0 text-ink-faint" />
            Aumentar prioridade
          </button>

          <button
            type="button"
            onClick={() => runFromSheet(onDelete)}
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
