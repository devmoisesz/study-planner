'use client';

import type { InputHTMLAttributes } from 'react';
import { useFieldControl } from '@/components/ui/field';
import { cn } from '@/lib/utils/cn';

interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Valor atual, exibido ao lado do controle. */
  value: number;
  /** Sufixo do valor, ex.: "%". */
  unit?: string;
  /** Legendas das extremidades, ex.: ["Nada", "Muito"]. */
  scaleLabels?: [string, string];
}

/**
 * input[type=range] nativo: teclado (setas, Home/End), leitor de tela e
 * toque ja funcionam sem nenhum JS.
 */
export function Slider({
  value,
  unit,
  scaleLabels,
  className,
  id,
  min = 0,
  max = 100,
  ...props
}: SliderProps) {
  const field = useFieldControl();

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-4">
        <input
          type="range"
          id={id ?? (field.controlId || undefined)}
          value={value}
          min={min}
          max={max}
          aria-describedby={field.describedBy}
          className={cn('range-slider flex-1', className)}
          {...props}
        />
        <output className="tabular w-12 shrink-0 text-right font-display text-lg font-semibold text-ink">
          {value}
          {unit ? <span className="text-sm text-ink-soft">{unit}</span> : null}
        </output>
      </div>

      {scaleLabels ? (
        <div className="flex justify-between pr-16 text-2xs text-ink-faint" aria-hidden>
          <span>{scaleLabels[0]}</span>
          <span>{scaleLabels[1]}</span>
        </div>
      ) : null}
    </div>
  );
}
