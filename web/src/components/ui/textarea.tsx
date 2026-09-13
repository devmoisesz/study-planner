'use client';

import type { TextareaHTMLAttributes } from 'react';
import { useFieldControl } from '@/components/ui/field';
import { cn } from '@/lib/utils/cn';

export function Textarea({
  className,
  id,
  rows = 3,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const field = useFieldControl();

  return (
    <textarea
      id={id ?? (field.controlId || undefined)}
      rows={rows}
      aria-describedby={field.describedBy}
      aria-invalid={field.invalid || undefined}
      aria-required={field.required || undefined}
      className={cn(
        'w-full resize-y rounded-sm border bg-surface px-3 py-2 text-sm text-ink transition-colors',
        'placeholder:text-ink-faint hover:border-ink-faint/60',
        'disabled:cursor-not-allowed disabled:bg-background disabled:text-ink-soft',
        field.invalid ? 'border-danger' : 'border-line',
        className,
      )}
      {...props}
    />
  );
}
