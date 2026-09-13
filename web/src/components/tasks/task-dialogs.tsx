'use client';

import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { ScoreChangeDialog } from '@/components/tasks/score-change-dialog';
import { applyPriorityBoost, applyProductivity } from '@/lib/domain/productivity';

interface ScoreDialogProps {
  open: boolean;
  onClose: () => void;
  currentScore: number;
  onConfirm: (percentage: number) => void;
  isPending?: boolean;
}

export function ProductivityDialog(props: ScoreDialogProps) {
  return (
    <ScoreChangeDialog
      {...props}
      title="Registrar produtividade"
      description="Quanto você considera que avançou nesta tarefa?"
      fieldLabel="Produtividade"
      fieldHint="Quanto mais você avançou, mais a prioridade cai."
      confirmLabel="Registrar"
      defaultPercentage={50}
      preview={applyProductivity}
    />
  );
}

export function IncreasePriorityDialog(props: ScoreDialogProps) {
  return (
    <ScoreChangeDialog
      {...props}
      title="Aumentar prioridade"
      description="Esta tarefa voltou a precisar de atenção?"
      fieldLabel="Aumento"
      fieldHint="O score nunca passa de 100."
      confirmLabel="Aumentar prioridade"
      defaultPercentage={50}
      preview={applyPriorityBoost}
    />
  );
}

interface DeleteTaskDialogProps {
  open: boolean;
  onClose: () => void;
  taskTitle: string;
  onConfirm: () => void;
  isPending?: boolean;
}

export function DeleteTaskDialog({
  open,
  onClose,
  taskTitle,
  onConfirm,
  isPending,
}: DeleteTaskDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Excluir tarefa"
      description="A tarefa sai do ranking junto com os recursos dela. Não dá para desfazer."
      footer={
        <>
          <Button onClick={onClose} disabled={isPending}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={onConfirm} isPending={isPending}>
            Excluir
          </Button>
        </>
      }
    >
      <p className="rounded-md bg-background px-4 py-3 text-sm font-medium text-ink">
        {taskTitle}
      </p>
    </Dialog>
  );
}
