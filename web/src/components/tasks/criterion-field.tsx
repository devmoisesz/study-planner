'use client';

import { TriangleAlert } from 'lucide-react';
import { Field } from '@/components/ui/field';
import { Slider } from '@/components/ui/slider';
import { CRITERION_MAX, CRITERION_MIN } from '@/lib/domain/initial-score';

interface CriterionFieldProps {
  label: string;
  /** Pergunta curta do front.md secao 11. */
  question: string;
  /** Aviso destacado — usado so no dominio, que funciona ao contrario. */
  warning?: string;
  scaleLabels: [string, string];
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export function CriterionField({
  label,
  question,
  warning,
  scaleLabels,
  value,
  onChange,
  disabled,
}: CriterionFieldProps) {
  return (
    <Field label={label} description={question}>
      {warning ? (
        <p className="mb-1 flex items-start gap-1.5 rounded-sm bg-brand-subtle px-2.5 py-1.5 text-2xs text-brand-strong">
          <TriangleAlert aria-hidden className="mt-px size-3 shrink-0" />
          {warning}
        </p>
      ) : null}

      <Slider
        value={value}
        min={CRITERION_MIN}
        max={CRITERION_MAX}
        step={1}
        scaleLabels={scaleLabels}
        disabled={disabled}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </Field>
  );
}
