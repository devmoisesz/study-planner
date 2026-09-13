'use client';

import type { InputHTMLAttributes } from 'react';
import { useFieldControl } from '@/components/ui/field';
import { cn } from '@/lib/utils/cn';

export function Input({
  className,
  id,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  const field = useFieldControl();

  return (
    <input
      id={id ?? (field.controlId || undefined)}
      aria-describedby={field.describedBy}
      aria-invalid={field.invalid || undefined}
      aria-required={field.required || undefined}
      className={cn(
        'h-10 w-full rounded-sm border bg-surface px-3 text-sm text-ink transition-colors',
        'placeholder:text-ink-faint hover:border-ink-faint/60',
        'disabled:cursor-not-allowed disabled:bg-background disabled:text-ink-soft',
        field.invalid ? 'border-danger' : 'border-line',
        className,
      )}
      {...props}
    />
  );
}
