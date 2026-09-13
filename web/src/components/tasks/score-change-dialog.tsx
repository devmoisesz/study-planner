'use client';

import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Field } from '@/components/ui/field';
import { Slider } from '@/components/ui/slider';
import { ScoreNumber } from '@/components/tasks/score-display';
import { scoreBand } from '@/lib/domain/score';

interface ScoreChangeDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  fieldLabel: string;
  fieldHint: string;
  confirmLabel: string;
  defaultPercentage: number;
  currentScore: number;
  /** Preview local; o valor oficial vem de quem confirma. */
  preview: (score: number, percentage: number) => number;
  onConfirm: (percentage: number) => void;
  isPending?: boolean;
}

/**
 * Base compartilhada por "registrar produtividade" e "aumentar prioridade":
 * as duas telas do front.md (17 e 18) sao a mesma interacao com formula
 * diferente — um percentual e o preview do score resultante.
 */
export function ScoreChangeDialog({
  open,
  onClose,
  title,
  description,
  fieldLabel,
  fieldHint,
  confirmLabel,
  defaultPercentage,
  currentScore,
  preview,
  onConfirm,
  isPending,
}: ScoreChangeDialogProps) {
  /**
   * Quem usa monta este componente so quando o dialogo abre, entao o estado
   * ja nasce no padrao a cada abertura — sem effect e sem render em cascata.
   */
  const [percentage, setPercentage] = useState(defaultPercentage);

  const nextScore = preview(currentScore, percentage);
  const nextBand = scoreBand(nextScore);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      footer={
        <>
          <Button onClick={onClose} disabled={isPending}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={() => onConfirm(percentage)} isPending={isPending}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <Field label={fieldLabel} hint={fieldHint}>
        <Slider
          value={percentage}
          unit="%"
          onChange={(event) => setPercentage(Number(event.target.value))}
          disabled={isPending}
        />
      </Field>

      <div className="flex items-center justify-center gap-5 rounded-md bg-background px-4 py-4">
        <div className="flex flex-col items-center gap-1">
          <span className="text-2xs font-medium text-ink-soft">Agora</span>
          <ScoreNumber score={currentScore} />
        </div>

        <ArrowRight aria-hidden className="size-4 shrink-0 text-ink-faint" />

        <div className="flex flex-col items-center gap-1">
          <span className="text-2xs font-medium text-ink-soft">Fica</span>
          <ScoreNumber score={nextScore} />
          <span className="text-2xs text-ink-soft">{nextBand.label}</span>
        </div>
      </div>
    </Dialog>
  );
}
